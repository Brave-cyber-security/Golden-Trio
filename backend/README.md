First create a database called `ecommerce` in PgAdmin 4.

```sql
-- Drop existing tables if they exist (in reverse order due to foreign keys)
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT
);

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC(10,2) NOT NULL,
    category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE
);

-- Insert seed data into categories
INSERT INTO categories (name, description) VALUES
('Electronics', 'Electronic items'),
('Books', 'All kinds of books'),
('Clothes', 'Men and women clothing')
ON CONFLICT DO NOTHING;

-- Insert seed data into users
INSERT INTO users (username, email, password) VALUES
('john_doe', 'john@example.com', 'password123'),
('alice', 'alice@example.com', 'alicepass'),
('mark', 'mark@example.com', 'markpass')
ON CONFLICT (email) DO NOTHING;

-- Insert seed data into products
INSERT INTO products (name, description, price, category_id) VALUES
('iPhone 14', 'Latest Apple smartphone', 999.99, 1),
('Laptop', 'Gaming laptop', 1299.49, 1),
('Harry Potter', 'Fiction book', 19.99, 2),
('T-Shirt', 'Cotton t-shirt', 9.99, 3)
ON CONFLICT DO NOTHING;

-- Verify data
SELECT * FROM categories;
SELECT * FROM users;
SELECT * FROM products;

-- Join query to see products with category names
SELECT p.*, c.name AS category_name
FROM products p
JOIN categories c ON p.category_id = c.id;
```

Then, create your own .env file at project root folder and fill in these details:

```env
PORT=""
DB_NAME="ecommerce"
DB_HOST="localhost"
DB_PORT="5432"
DB_USER="postgres"
DB_PASS=""
```


That's it, run the server:
```bash
npm run dev
```

> Note you must have NodeJS installed on your laptop.