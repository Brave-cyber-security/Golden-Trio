import { pool } from "../config/database.js";

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products");
    res.status(200).json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to fetch products', details: err.message });
  }
};

// Get a single product by id
export const getProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    const result = await pool.query(
      "SELECT * FROM products WHERE id = $1",
      [productId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

// Add new product
export const createProduct = async (req, res) => {
  const { name, description, price, category_id } = req.body;
  if (!name || !price || !category_id) {
    return res.status(400).json({ error: "Missing required fields: name, price, category_id" });
  }
  try {
    const result = await pool.query(
      "INSERT INTO products (name, description, price, category_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, description, price, category_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to add product", details: err.message });
  }
};

// Update a product by id
export const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { name, description, price, category_id } = req.body;
    const result = await pool.query(
      "UPDATE products SET name = $1, description = $2, price = $3, category_id = $4 WHERE id = $5 RETURNING *",
      [name, description, price, category_id, productId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json({ message: "Updated successfully", data: result.rows[0] });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to update product" });
  }
};

// Delete a product by id
export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const result = await pool.query(
      "DELETE FROM products WHERE id = $1 RETURNING *",
      [productId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json({ message: "Deleted successfully", data: result.rows[0] });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to delete product" });
  }
};
