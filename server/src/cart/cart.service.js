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
