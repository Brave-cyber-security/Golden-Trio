import { pool } from "../config/database.js";

// Get all categories
export const getAllCategories = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM categories");
    res.status(200).json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

// Get a single category by id
export const getCategoryById = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const result = await pool.query(
      "SELECT * FROM categories WHERE id = $1",
      [categoryId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to fetch category' });
  }
};

// Add new category
export const createCategory = async (req, res) => {
  const { name, description } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Missing required field: name" });
  }
  try {
    const result = await pool.query(
      "INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *",
      [name, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to add category" });
  }
};

// Update a category by id
export const updateCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { name, description } = req.body;
    const result = await pool.query(
      "UPDATE categories SET name = $1, description = $2 WHERE id = $3 RETURNING *",
      [name, description, categoryId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.status(200).json({ message: "Updated successfully", data: result.rows[0] });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to update category" });
  }
};

// Delete a category by id
export const deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const result = await pool.query(
      "DELETE FROM categories WHERE id = $1 RETURNING *",
      [categoryId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.status(200).json({ message: "Deleted successfully", data: result.rows[0] });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to delete category" });
  }
};
