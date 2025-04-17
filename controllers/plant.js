const asyncHandler = require("express-async-handler");
const {getAllCatalogPlants,getCatalogPlantById,searchCatalogPlants, createUserPlant,updateUserPlant,deleteUserPlant} = require("../models/plant");

// Get all plants
const getPlants = asyncHandler(async (req, res) => {
    const result = await getAllCatalogPlants();
    res.json(result.rows);
});

// Get a plant by ID
const getPlantById = asyncHandler(async (req, res) => {
  const { id } = req.params;
    const result = await getCatalogPlantById(id);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Plant not found" });
    }
    res.json(result.rows[0]);
});

// Search for plants by common name
const searchPlants = asyncHandler(async (req, res) => {
  const { query } = req.query;
    const result = await searchCatalogPlants(query);
    res.json(result.rows);
});


// Create a new plant for user
const createPlant = asyncHandler(async (req, res) => {
  const { nickname, plant_id, user_id, garden_id } = req.body;
    const result = await createUserPlant(nickname, plant_id, user_id, garden_id);
    res.status(201).json(result.rows[0]);
});


// Update a plant for user
const updatePlant = asyncHandler(async (req, res) => {
  const { id } = req.params;  // id of the user_plant entry
  const { nickname, date_watered, harvest_status } = req.body;
    const result = await updateUserPlant(nickname, date_watered, harvest_status, id, req.user.id);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Plant not found for this user" });
    }
    res.json(result.rows[0]);
});


// Delete a plant for user
const deletePlant = asyncHandler(async (req, res) => {
  const { id } = req.params;  // id of the user_plant entry
    const result = await deleteUserPlant(id, req.user.id);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Plant not found for this user" });
    }
    res.json({ success: true, message: "Plant deleted successfully" });
});


module.exports = { getPlants, getPlantById, createPlant, updatePlant, deletePlant, searchPlants };
