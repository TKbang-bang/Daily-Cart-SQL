import pool from "../db/db.js";

export const getOrdersService = async (userID) => {
  const { rows: orders } = await pool.query(
    `
        SELECT
            o.status,
            p.*,
            oi.quantity
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        JOIN products p ON oi.product_id = p.id
        WHERE o.user_id = $1 AND (
            o.status = 'pending'
            OR o.status = 'delivered'
            OR o.status = 'cancelled'
        )
    `,
    [userID],
  );

  return orders;
};
