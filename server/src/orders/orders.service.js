import pool from "../db/db.js";

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
