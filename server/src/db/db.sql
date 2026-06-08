-- configs
CREATE EXTENSION IF NOT EXISTS pgcrypto;
-- ENUMS
CREATE TYPE staff_roles AS ENUM ('admin', 'manager');

-- TABLES
-- users
CREATE TABLE IF NOT EXISTS users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    firstname varchar(255) NOT NULL,
    lastname varchar(255) NOT NULL,
    email varchar(255) NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP,

    CONSTRAINT users_unique_email UNIQUE (email)
);

-- staff members
CREATE TABLE IF NOT EXISTS staff_members (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    profile TEXT NOT NULL,
    role staff_roles NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- CATEGORIES
CREATE TABLE IF NOT EXISTS categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(150) NOT NULL,

    CONSTRAINT categories_unique_slug UNIQUE (slug)
);
-- SUBCATEGORIES
CREATE TABLE IF NOT EXISTS subcategories (
    id BIGSERIAL PRIMARY KEY,
    category_id BIGINT NOT NULL,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(150) NOT NULL,
    FOREIGN KEY (category_id)
        REFERENCES categories(id)
        ON DELETE CASCADE,

    CONSTRAINT subcategories_unique_slug UNIQUE (slug)
);

-- BRANDS
CREATE TABLE IF NOT EXISTS brands (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(150) NOT NULL,

    CONSTRAINT brands_unique_slug UNIQUE (slug)
);

-- PRODUCTS
CREATE TABLE IF NOT EXISTS products (
    id BIGSERIAL PRIMARY KEY,
    subcategory_id BIGINT NOT NULL,
    brand_id BIGINT,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(150) NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    discount_percent NUMERIC(5, 2),
    image TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP,

    FOREIGN KEY (subcategory_id)
        REFERENCES subcategories(id)
        ON DELETE CASCADE,
    FOREIGN KEY (brand_id)
        REFERENCES brands(id)
        ON DELETE SET NULL,
    CONSTRAINT products_unique_slug UNIQUE (slug),
    CONSTRAINT products_price_check CHECK(price > 0),
    CONSTRAINT products_discount_percent_check
        CHECK(discount_percent >= 0 AND discount_percent <= 100)
);

-- STOCKS
CREATE TABLE IF NOT EXISTS stocks (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL,
    quantity INTEGER NOT NULL,
    status stock_status GENERATED ALWAYS AS (
        CASE
            WHEN quantity > 10 THEN 'active'::stock_status
            WHEN quantity BETWEEN 1 AND 10 THEN 'low'::stock_status
            ELSE 'inactive'::stock_status
        END
    ) STORED,
    FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE CASCADE,
    CONSTRAINT  stocks_unique_product_id UNIQUE (product_id),
    CONSTRAINT stocks_quantity_check CHECK(quantity >= 0)
);

-- TAGS
CREATE TABLE IF NOT EXISTS tags (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(150) NOT NULL,
    
    CONSTRAINT tags_unique_slug UNIQUE (slug)
);
-- PRODUCTS TAGS
CREATE TABLE IF NOT EXISTS products_tags (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL,
    tag_id BIGINT NOT NULL,

    FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE CASCADE,
    FOREIGN KEY (tag_id)
        REFERENCES tags(id)
        ON DELETE CASCADE,
    CONSTRAINT products_tags_unique UNIQUE(product_id, tag_id)
);
