import pool from "../db/db.js";
import ServerError from "../errors/server.error.js";

export const getOrdersService = async (userID) => {
  const { rows: orders } = await pool.query(
    `
    SELECT
        p.id,
        p.name,
        p.slug,
        p.description,
        p.category_id,
        p.stock,
        p.image,
        oi.price,
        oi.quantity,
        o.total,
        o.status
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN products p ON oi.product_id = p.id
    WHERE o.user_id = $1 AND (
        o.status = 'processing'
        OR o.status = 'packed'
        OR o.status = 'shipped'
    )
    `,
    [userID],
  );

  return orders;
};

export const getOrdersByStatusService = async (userID, status) => {
  // chek if the user is a staff member
  const { rows: staffUser } = await pool.query(
    `SELECT 1 FROM staff_members WHERE user_id = $1`,
    [userID],
  );
  if (staffUser.length === 0) throw new ServerError("You are not allowed", 401);

  let orderStatus = ["processing", "packed", "shipped"];
  if (!orderStatus.includes(status))
    throw new ServerError("Invalid status", 400);

  const { rows: ordersByStatus } = await pool.query(
    `
    SELECT
      fb.id AS fulfillment_id,
      fb.status AS fulfillment_status,
      fb.stage AS fulfillment_stage,
      COUNT(o.id) AS total_orders
    FROM fulfillment_batches fb
    JOIN fulfillment_items fi ON fb.id = fi.batch_id
    JOIN orders o ON fi.order_id = o.id
    WHERE fb.status = 'active' AND (fb.stage = $1 AND o.status = $2)
    GROUP BY fb.id
    `,
    [status, status],
  );

  return ordersByStatus;
};

export const updateFulfillmentStatusService = async (fulfillmentID, userID) => {
  // check if the user is a staff member
  const { rows: staffUser } = await pool.query(
    `SELECT 1 FROM staff_members WHERE user_id = $1`,
    [userID],
  );
  if (staffUser.length === 0) throw new ServerError("You are not allowed", 401);

  // getting fulfillment batch
  const { rows: fulfillmentBatch } = await pool.query(
    `SELECT * FROM fulfillment_batches WHERE id = $1`,
    [fulfillmentID],
  );
  if (fulfillmentBatch.length === 0)
    throw new ServerError("Fulfillment batch not found", 404);

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // updating stages and status
    if (fulfillmentBatch[0].stage === "processing") {
      // processing => packed
      await client.query(
        `UPDATE fulfillment_batches SET stage = 'packed' WHERE id = $1`,
        [fulfillmentID],
      );
      // update order status
      await client.query(
        `UPDATE orders SET status = 'packed' WHERE id IN (
          SELECT order_id FROM fulfillment_items WHERE batch_id = $1
        )`,
        [fulfillmentID],
      );
    } else if (fulfillmentBatch[0].stage === "packed") {
      // packed => shipped
      await client.query(
        `UPDATE fulfillment_batches SET stage = 'shipped' WHERE id = $1`,
        [fulfillmentID],
      );
      // update order status
      await client.query(
        `UPDATE orders SET status = 'shipped' WHERE id IN (
          SELECT order_id FROM fulfillment_items WHERE batch_id = $1
        )`,
        [fulfillmentID],
      );
    } else if (fulfillmentBatch[0].stage === "shipped") {
      // shipped => delivered and completed
      await client.query(
        `UPDATE fulfillment_batches SET status = 'completed' WHERE id = $1`,
        [fulfillmentID],
      );
      // update order status
      await client.query(
        `UPDATE orders SET status = 'delivered' WHERE id IN (
          SELECT order_id FROM fulfillment_items WHERE batch_id = $1
        )`,
        [fulfillmentID],
      );
    }

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
