import pool from "../db/db.js";

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
