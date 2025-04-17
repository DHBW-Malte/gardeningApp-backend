const asyncHandler = require("express-async-handler");
const {getAllCatalogPlants,getCatalogPlantById,searchCatalogPlants, findPlantsByUser, createUserPlant,updateUserPlant,deleteUserPlant} = require("../models/plant");

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

// Get all plants for a user
const getUserPlants = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await findPlantsByUser(id);

  const userPlants = result.rows.map(row => ({
    id: row.user_plant_id,
    nickname: row.nickname,
    user_id: row.user_id,
    garden_id: row.garden_id,
    plant_id: row.plant_id,
    date_added: row.date_added,
    date_watered: row.date_watered,
    harvest_status: row.harvest_status,
    catalogPlant: {
      id: row.catalog_plant_id,
      common_name: row.common_name,
      scientific_name: row.scientific_name,
      width: row.width,
      height: row.height,
      min_temperature: row.min_temperature,
      max_temperature: row.max_temperature,
      planting_start: row.planting_start,
      planting_end: row.planting_end,
      blooming_start: row.blooming_start,
      blooming_end: row.blooming_end,
      flower_color: row.flower_color,
      harvest_start: row.harvest_start,
      harvest_end: row.harvest_end,
      edible_parts: row.edible_parts,
      yield: row.yield,
      sun_light: row.sun_light,
      water_frequency: row.water_frequency,
      feeding_frequency: row.feeding_frequency,
      fertilizer_type: row.fertilizer_type
    }
  }));

  res.json(userPlants);
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


module.exports = { getPlants, getPlantById, getUserPlants, createPlant, updatePlant, deletePlant, searchPlants };
