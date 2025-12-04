import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || "5432",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASS || "12431243aA",
  database: process.env.DB_NAME || "ecommerce",
});

// Initialize database tables
async function initDatabase() {
  try {
    await pool.connect();
    console.log("Connected to the database.");

    // Create tables if they don't exist
    await pool.query(`
            CREATE TABLE IF NOT EXISTS categories (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                description TEXT
            );
        `);

    await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL
            );
        `);

    await pool.query(`
            CREATE TABLE IF NOT EXISTS products (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                price NUMERIC(10,2) NOT NULL,
                category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE
            );
        `);

    console.log("Tables created successfully or already exist.");

    // Insert sample categories if table is empty
    const categoriesCount = await pool.query("SELECT COUNT(*) FROM categories");
    if (categoriesCount.rows[0].count === "0") {
      await pool.query(`
                INSERT INTO categories (name, description) VALUES 
                ('Electronics', 'Electronics and gadgets'),
                ('Clothing', 'Men and women clothing'),
                ('Books', 'Various books'),
                ('Food', 'Food products'),
                ('Sports', 'Sports equipment')
            `);
      console.log("Sample categories added.");
    }
  } catch (err) {
    console.log("Error connecting to the database:", err);
    process.exit(1);
  }
}

export { pool, initDatabase };
