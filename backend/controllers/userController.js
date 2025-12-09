import { pool } from "../config/database.js";

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.status(200).json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Get a single user by id
export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(
      "SELECT * FROM users WHERE id = $1",
      [userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

// Add new user
export const createUser = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    const result = await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
      [username, email, password]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to add user", details: err.message });
  }
};

// Update a user by id
export const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { username, email, password } = req.body;
    const result = await pool.query(
      "UPDATE users SET username = $1, email = $2, password = $3 WHERE id = $4 RETURNING *",
      [username, email, password, userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "Updated successfully", data: result.rows[0] });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to update user" });
  }
};

// Delete a user by id
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(
      "DELETE FROM users WHERE id = $1 RETURNING *",
      [userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "Deleted successfully", data: result.rows[0] });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to delete user" });
  }
};
