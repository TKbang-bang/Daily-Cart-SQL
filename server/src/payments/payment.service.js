import pool from "../db/db.js";
import ServerError from "../errors/server.error.js";
import stripe from "../utils/stripe.js";

export const createPaymentSessionService = async (
  productID,
  quantity,
  userID,
) => {
  // check if the product is in db
  const { rows: productByID } = await pool.query(
    `SELECT * FROM products WHERE id = $1`,
    [productID],
  );
  if (productByID.length === 0) throw new ServerError("Product not found", 404);

  // check if the product in stock is enough
  if (productByID[0].stock < quantity)
    throw new ServerError("Not enough stock", 409);

  // starting the payment session
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // creating order
    const { rows: order } = await client.query(
      `INSERT INTO orders (user_id, total) VALUES ($1, $2) RETURNING id`,
      [
        userID,
        productByID[0].price *
          (1 - (productByID[0].discount_percent || 0) / 100) *
          quantity,
      ],
    );
    // inserting items
    await client.query(
      `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)`,
      [
        order[0].id,
        productID,
        quantity,
        productByID[0].price *
          (1 - (productByID[0].discount_percent || 0) / 100),
      ],
    );

    // starting the session
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: productByID[0].name,
              description:
                productByID[0].description || "No description provided",
            },
            unit_amount:
              productByID[0].price *
              (1 - (productByID[0].discount_percent || 0) / 100) *
              100,
          },
          quantity: quantity,
        },
      ],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/payment/success/${order[0].id}`,
      cancel_url: `${process.env.CLIENT_URL}/payment/failure/${order[0].id}`,
    });

    // inserting payment data
    await client.query(
      `INSERT INTO payments (order_id, transaction_id, amount) VALUES ($1, $2, $3)`,
      [order[0].id, session.id, session.amount_total / 100],
    );

    // getting a fulfillment batche
    let dbID = null;
    const { rows: fulfillmentBatch } = await client.query(
      `SELECT id FROM fulfillment_batches
      WHERE status = 'active' AND stage = 'processing' LIMIT 1`,
    );

    if (fulfillmentBatch.length === 0) {
      // if not, create it
      const { rows: newFulfillmentBatch } = await client.query(
        `INSERT INTO fulfillment_batches (status) VALUES ('active') RETURNING id`,
      );

      dbID = newFulfillmentBatch[0].id;
    } else {
      // check if fulfillment batch is not full FULFILLMENT_MAX
      const { rows: batchCount } = await client.query(
        `SELECT COUNT(*) FROM fulfillment_items WHERE batch_id = $1`,
        [fulfillmentBatch[0].id],
      );
      if (batchCount[0].count >= process.env.FULFILLMENT_MAX) {
        const { rows: newFulfillmentBatch } = await client.query(
          `INSERT INTO fulfillment_batches (status) VALUES ('active') RETURNING id`,
        );
        dbID = newFulfillmentBatch[0].id;
      } else {
        dbID = fulfillmentBatch[0].id;
      }
    }
    // items
    await client.query(
      `INSERT INTO fulfillment_items (batch_id, order_id) VALUES ($1, $2)`,
      [dbID, order[0].id],
    );

    await client.query("COMMIT");

    return session.url;
  } catch (error) {
    await client.query("ROLLBACK");

    if (error instanceof ServerError)
      throw new ServerError("Something went wrong", 500);

    throw error;
  } finally {
    await client.release();
  }
};

export const paymentSuccessService = async (orderID, userID) => {
  // check if the order is in db
  const { rows: order } = await pool.query(
    `SELECT * FROM orders WHERE id = $1`,
    [orderID],
  );
  if (order.length === 0) throw new ServerError("Order not found", 404);

  // check if the user owns the order
  if (order[0].user_id !== userID)
    throw new ServerError("You are not allowed", 401);

  const client = await pool.connect();
  try {
    // updating order status
    await pool.query(`UPDATE orders SET status = 'processing' WHERE id = $1`, [
      orderID,
    ]);

    // updating payment status
    await pool.query(
      `UPDATE payments SET status = 'paid' WHERE order_id = $1`,
      [orderID],
    );

    // updating product stock
    await pool.query(
      `UPDATE products SET stock = stock - (
        SELECT quantity FROM order_items WHERE order_id = $1
      ) WHERE id IN (
        SELECT product_id FROM order_items WHERE order_id = $1
      )`,
      [orderID],
    );

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");

    if (error instanceof ServerError)
      throw new ServerError("Something went wrong", 500);

    throw error;
  } finally {
    await client.release();
  }
};

export const paymentCancelService = async (orderID, userID) => {
  // check if the order is in db
  const { rows: order } = await pool.query(
    `SELECT * FROM orders WHERE id = $1`,
    [orderID],
  );
  if (order.length === 0) throw new ServerError("Order not found", 404);

  // check if the user owns the order
  if (order[0].user_id !== userID)
    throw new ServerError("You are not allowed", 401);

  const client = await pool.connect();
  try {
    // updating order status
    await pool.query(`UPDATE orders SET status = 'cancelled' WHERE id = $1`, [
      orderID,
    ]);

    // updating payment status
    await pool.query(
      `UPDATE payments SET status = 'failed' WHERE order_id = $1`,
      [orderID],
    );

    // deleting fulfillment_items
    await pool.query(`DELETE FROM fulfillment_items WHERE order_id = $1`, [
      orderID,
    ]);

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");

    if (error instanceof ServerError)
      throw new ServerError("Something went wrong", 500);

    throw error;
  } finally {
    await client.release();
  }
};
