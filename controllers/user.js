const pool = require("../config/db");
const asyncHandler = require("express-async-handler");

// Get User Profile
const getUserProfile = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM app_user WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create User Profile
const createUserProfile = asyncHandler(async (req, res) => {
  const { username, email } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO app_user (username, email) VALUES ($1, $2) RETURNING *",
      [username, email]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update User Profile
const updateUserProfile = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { username, email } = req.body;
  try {
    const result = await pool.query(
      "UPDATE app_user SET username = $1, email = $2 WHERE id = $3 RETURNING *",
      [username, email, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all gardens for a user
const getUserGardens = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM garden WHERE user_id = $1", [id]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all plants for a user
const getUserplants = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM user_plant WHERE user_id = $1", [id]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = { getUserProfile, createUserProfile, updateUserProfile, getUserGardens, getUserplants };
