const pool = require("../config/db");
const asyncHandler = require("express-async-handler");
// Get all gardens for a specific user
const getGardensByUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query("SELECT * FROM garden WHERE user_id = $1", [userId]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new garden
const createGarden = asyncHandler(async (req, res) => {
  const {user_id, name } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO garden (user_id, name) VALUES ($1, $2) RETURNING *",
      [user_id, name]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update the garden by user
const updateGarden = asyncHandler(async (req, res) => {
  const { id } = req.params;  
  const { name } = req.body;  
  const user_id = req.user.id; 

  try {
    
    const result = await pool.query(
      "UPDATE garden SET name = $1 WHERE id = $2 AND user_id = $3 RETURNING *",
      [name, id, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Garden not found or you're not the owner" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a garden by user
const deleteGarden = asyncHandler(async (req, res) => {
  const { id } = req.params; 
  const user_id = req.user.id; // Get authenticated user's ID from JWT

  try {
    const result = await pool.query(
      "DELETE FROM garden WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Garden not found or you're not the owner" });
    }

    res.json({ success: true, message: "Garden deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = { getGardensByUser, createGarden, updateGarden, deleteGarden };
