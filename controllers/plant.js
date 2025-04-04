const pool = require("../config/db");
const asyncHandler = require("express-async-handler");

// Get all plants
const getPlants = asyncHandler(async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM catalog_plant");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a plant by ID
const getPlantById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM catalog_plant WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Plant not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search for plants by common name
const searchPlants = asyncHandler(async (req, res) => {
  const { query } = req.query;
  try {
    const result = await pool.query("SELECT * FROM catalog_plant WHERE common_name ILIKE $1", [`%${query}%`]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new plant for user
const createPlant = asyncHandler(async (req, res) => {
  const { nickname, plant_id, user_id, garden_id } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO user_plant (nickname, plant_id, user_id, garden_id, date_added) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP) RETURNING *",
      [nickname, plant_id, user_id, garden_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Update a plant for user
const updatePlant = asyncHandler(async (req, res) => {
  const { id } = req.params;  // id of the user_plant entry
  const { nickname, date_watered, harvest_status } = req.body;
  try {
    const result = await pool.query(
      "UPDATE user_plant SET nickname = $1, date_watered = $2, harvest_status = $3 WHERE id = $4 AND user_id = $5 RETURNING *",
      [nickname, date_watered, harvest_status, id, req.user.id]  // assuming `req.user.id` holds the logged-in user's ID
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Plant not found for this user" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Delete a plant for user
const deletePlant = asyncHandler(async (req, res) => {
  const { id } = req.params;  // id of the user_plant entry
  try {
    const result = await pool.query(
      "DELETE FROM user_plant WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, req.user.id]  // assuming `req.user.id` holds the logged-in user's ID
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Plant not found for this user" });
    }
    res.json({ success: true, message: "Plant deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = { getPlants, getPlantById, createPlant, updatePlant, deletePlant, searchPlants };
