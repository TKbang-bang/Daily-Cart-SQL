import pool from "../db/db.js";
import ServerError from "../errors/server.error.js";

export const cartCountService = async (userID) => {
  const { rows: cartCount } = await pool.query(
    `
            SELECT COUNT(ci.*) AS count FROM cart_items ci
            JOIN cart c ON ci.cart_id = c.id
            WHERE c.user_id = $1
        `,
    [userID],
  );

  return cartCount[0].count;
};

export const addOrRemoveToCartService = async (productID, userID) => {
  // check if the cart exists for the user
  const { rows: userCart } = await pool.query(
    `SELECT * FROM cart WHERE user_id = $1 LIMIT 1`,
    [userID],
  );

  let cartID = null;
  if (userCart.length === 0) {
    // if not, create it
    const { rows: newCart } = await pool.query(
      `INSERT INTO cart (user_id) VALUES ($1) RETURNING id`,
      [userID],
    );

    cartID = newCart[0].id;
  } else {
    cartID = userCart[0].id;
  }

  // check if the product is already in the cart
  const { rows: productInCart } = await pool.query(
    `SELECT * FROM cart_items WHERE cart_id = $1 AND product_id = $2 LIMIT 1`,
    [cartID, productID],
  );

  if (productInCart.length === 0) {
    // if not, add it
    await pool.query(
      `INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ($1, $2, 1)`,
      [cartID, productID],
    );

    return { created: true };
  } else {
    // if yes, remove it
    await pool.query(
      `DELETE FROM cart_items WHERE cart_id = $1 AND product_id = $2`,
      [cartID, productID],
    );

    return { created: false };
  }
};

export const cartProductsService = async (userID) => {
  // verify if the user has a cart
  const { rows: userCart } = await pool.query(
    `SELECT * FROM cart WHERE user_id = $1 LIMIT 1`,
    [userID],
  );
  let cartID = null;
  if (userCart.length === 0) {
    const { rows: newCart } = await pool.query(
      `INSERT INTO cart (user_id) VALUES ($1) RETURNING id`,
      [userID],
    );

    cartID = newCart[0].id;
  } else {
    cartID = userCart[0].id;
  }

  const { rows: cartItems } = await pool.query(
    `
    SELECT
      p.*,
      ci.quantity
    FROM cart_items ci
    JOIN cart c ON ci.cart_id = c.id
    JOIN products p ON ci.product_id = p.id
    WHERE c.user_id = $1
    `,
    [userID],
  );

  return cartItems;
};

export const deleteCartProductService = async (id, userID) => {
  // check if the user owns the cart
  const { rows: userCart } = await pool.query(
    `SELECT * FROM cart WHERE user_id = $1 LIMIT 1`,
    [userID],
  );
  if (userCart.length === 0) throw new ServerError("Cart not found", 404);

  await pool.query(
    `DELETE FROM cart_items WHERE product_id = $1 AND cart_id = $2`,
    [id, userCart[0].id],
  );
};

export const getPurchasedProductsService = async (userID) => {
  const { rows: purchasedProducts } = await pool.query(
    `
    SELECT
      p.*,
      oi.quantity
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN products p ON oi.product_id = p.id
    WHERE o.user_id = $1 AND o.status = 'delivered'
    `,
    [userID],
  );

  return purchasedProducts;
};
