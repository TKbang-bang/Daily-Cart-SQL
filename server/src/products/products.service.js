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

    // creating logs
    await client.query(
      `INSERT INTO logs (user_id, action) VALUES ($1, $2) RETURNING *`,
      [userID, `create product with id ${product[0].id}`],
    );

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");

    if (error instanceof ServerError) throw error;
    throw new ServerError("Internal server error", 500);
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

export const getProductService = async (id, userID) => {
  const { rows: product } = await pool.query(
    `
        WITH oneProduct AS (
            SELECT
                p.*,
                c.name AS category,
                ARRAY_AGG(t.name) AS tags
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN products_tags pt ON p.id = pt.product_id
            LEFT JOIN tags t ON pt.tag_id = t.id
            WHERE p.id = $2
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
            op.*,
            CASE
                WHEN op.id IN (SELECT product_id FROM myCart) THEN true
                ELSE false
            END AS in_cart
        FROM oneProduct op
    `,
    [userID, id],
  );

  return product[0];
};

export const updateProductsService = async (
  id,
  name,
  description,
  category,
  price,
  discount,
  stock,
  tags,
  userID,
) => {
  // sanitization
  const capitalizedCategory =
    category.charAt(0).toUpperCase() + category.slice(1);

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // check if the user is a staff member
    const { rows: staffUser } = await client.query(
      "SELECT 1 FROM staff_members WHERE user_id = $1 LIMIT 1",
      [userID],
    );
    if (staffUser.length === 0)
      throw new ServerError("You are not allowed", 401);

    // check if discount is between 0 and 100
    if (discount < 0 || discount > 100)
      throw new ServerError("Invalid discount", 400);
    const discountVal = discount > 0 ? discount : null;

    // check if category exists
    const { rows: categoryExists } = await client.query(
      `SELECT * FROM categories WHERE name = $1`,
      [capitalizedCategory],
    );
    let catID = 0;
    if (categoryExists.length === 0) {
      const { rows: newCategory } = await client.query(
        `INSERT INTO categories (name, slug) VALUES ($1, $2) RETURNING *`,
        [
          capitalizedCategory,
          capitalizedCategory.replace(/\s+/g, "-").toLowerCase(),
        ],
      );
      catID = newCategory[0].id;
    } else {
      catID = categoryExists[0].id;
    }

    // check if the product exists
    const { rows: productExists } = await client.query(
      `SELECT * FROM products WHERE id = $1`,
      [id],
    );
    if (productExists.length === 0)
      throw new ServerError("Product not found", 404);

    // update product
    await client.query(
      `
        UPDATE products
            SET name = $1,
            description = $2,
            category_id = $3,
            price = $4,
            discount_percent = $5,
            stock = $6,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $7
      `,
      [name, description, catID, price, discountVal, stock, id],
    );

    // delete old tags
    await client.query(`DELETE FROM products_tags WHERE product_id = $1`, [id]);

    // add new tags
    for (let tagName of tags) {
      const { rows: uTag } = await client.query(
        `SELECT * FROM tags WHERE name = $1`,
        [tagName],
      );

      if (uTag.length === 0) {
        const { rows: newTag } = await client.query(
          `INSERT INTO tags (name, slug) VALUES ($1, $2) RETURNING *`,
          [tagName, tagName.replace(/\s+/g, "-").toLowerCase()],
        );

        await client.query(
          `INSERT INTO products_tags (product_id, tag_id) VALUES ($1, $2)`,
          [id, newTag[0].id],
        );
      } else {
        await client.query(
          `INSERT INTO products_tags (product_id, tag_id) VALUES ($1, $2)`,
          [id, uTag[0].id],
        );
      }
    }

    // creating logs
    await client.query(`INSERT INTO logs (user_id, action) VALUES ($1, $2)`, [
      userID,
      `Updated product with id ${id}`,
    ]);

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");

    console.log(error);
    if (error instanceof ServerError) throw error;
    throw new ServerError("Internal server error", 500);
  } finally {
    await client.release();
  }
};

export const getCategoriesService = async () => {
  const { rows: categories } = await pool.query(`SELECT * FROM categories`);
  return categories;
};

export const getProductsByAllCategoriesService = async (userID) => {
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

export const getProductsByCategoryService = async (category, userID) => {
  // getting category id
  const { rows: categoryByName } = await pool.query(
    `SELECT id FROM categories WHERE name = $1 LIMIT 1`,
    [category],
  );
  if (categoryByName.length === 0)
    throw new ServerError("Category not found", 404);

  const catID = categoryByName[0].id;

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
            WHERE p.category_id = $2
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
    [userID, catID],
  );

  return products;
};
