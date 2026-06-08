import pool from "../db/db.js";
import ServerError from "../errors/server.error.js";

export const createProductsService = async (
  filename,
  name,
  description,
  category,
  price,
  stock,
  tags,
  userID,
) => {
  const jsonTags = JSON.parse(tags);
  const capitalizedCategory =
    category.charAt(0).toUpperCase() + category.slice(1);

  // check if the user is a staff member
  const { rows: staffUser } = await pool.query(
    "SELECT * FROM staff_members WHERE user_id = $1",
    [userID],
  );
  if (staffUser.length === 0) throw new ServerError("You are not allowed", 401);

  // creating the product
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // getting category
    let catID = null;
    const { rows: category } = await client.query(
      `SELECT * FROM categories WHERE name = $1`,
      [capitalizedCategory],
    );
    if (category.length === 0) {
      const { rows: newCategory } = await client.query(
        `INSERT INTO categories (name, slug) VALUES ($1, $2) RETURNING *`,
        [
          capitalizedCategory,
          capitalizedCategory.replace(/\s+/g, "-").toLowerCase(),
        ],
      );
      catID = newCategory[0].id;
    } else {
      catID = category[0].id;
    }

    // product
    const { rows: product } = await client.query(
      `
            INSERT INTO products (
                name,
                slug,
                description,
                category_id,
                price,
                stock,
                image
            ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *
        `,
      [
        name,
        name.replace(/\s+/g, "-").toLowerCase(),
        description,
        catID,
        price,
        stock,
        filename,
      ],
    );

    // tags
    for (let i = 0; i < jsonTags.length; i++) {
      // check if the tag exists
      const { rows: tag } = await client.query(
        `SELECT * FROM tags WHERE name = $1`,
        [jsonTags[i]],
      );
      if (tag.length === 0) {
        const { rows: newTag } = await client.query(
          `INSERT INTO tags (name, slug) VALUES ($1, $2) RETURNING *`,
          [jsonTags[i], jsonTags[i].replace(/\s+/g, "-").toLowerCase()],
        );
        await client.query(
          `INSERT INTO products_tags (product_id, tag_id) VALUES ($1, $2) RETURNING *`,
          [product[0].id, newTag[0].id],
        );
      } else {
        await client.query(
          `INSERT INTO products_tags (product_id, tag_id) VALUES ($1, $2) RETURNING *`,
          [product[0].id, tag[0].id],
        );
      }
    }

    await client.query("COMMIT");
    return;
  } catch (error) {
    await client.query("ROLLBACK");
    throw new ServerError(error.message, 500);
  } finally {
    await client.release();
  }
};

export const getProductsService = async (userID) => {
  const { rows: products } = await pool.query(
    `
        WITH allProducts AS (
            SELECT
                p.*,
                c.name AS category,
                ARRAY_AGG(t.name) AS tags
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN products_tags pt ON p.id = pt.product_id
            LEFT JOIN tags t ON pt.tag_id = t.id
            GROUP BY p.id, c.name
        ),
        myCart AS (
            SELECT
                ci.product_id
            FROM cart_items ci
            JOIN cart c ON ci.cart_id = c.id
            WHERE c.user_id = $1
        )

        SELECT
            ap.*,
            CASE
                WHEN ap.id IN (SELECT product_id FROM myCart) THEN true
                ELSE false
            END AS in_cart
        FROM allProducts ap
    `,
    [userID],
  );

  return products;
};
