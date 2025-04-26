const asyncHandler = require("express-async-handler");
const {getAllCatalogPlants,getCatalogPlantById,searchCatalogPlants, createUserPlant,updateUserPlant,deleteUserPlant} = require("../models/plant");
const { formatCatalogPlant, formatUserPlant } = require("../utils/plantFormatter");

// Get all catalog plants
const getPlants = asyncHandler(async (req, res) => {
  const result = await getAllCatalogPlants();

  const catalogPlants = result.rows.map(formatCatalogPlant);
  res.json(catalogPlants);
});

// Get a plant by ID
const getPlantById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await getCatalogPlantById(id);
  
  if (result.rows.length === 0) {
    return res.status(404).json({ error: "Plant not found" });
  }

  const plant = formatCatalogPlant(result.rows[0]);
  res.json(plant);
});


// Search for plants by common name
const searchPlants = asyncHandler(async (req, res) => {
  onsole.log("TOP OF searchPlants");
  const { query } = req.query;
  console.log("Query", query);
  const result = await searchCatalogPlants(query);

  const searchResult = result.rows.map(formatCatalogPlant);
  res.json(searchResult);
});


// Create a new plant for user
const createPlant = asyncHandler(async (req, res) => {
  const user_id = req.user.id;
  const { nickname, plant_id, garden_id } = req.body;

  const createdPlant = await createUserPlant(nickname, plant_id, user_id, garden_id);
  const formattedPlant = formatUserPlant(createdPlant);
  res.json(formattedPlant);
});


// Update a plant for user
const updatePlant = asyncHandler(async (req, res) => {
  const user_id = req.user.id;
  const { id } = req.params;
  const { nickname, date_watered, harvest_status } = req.body;

  const updated = await updateUserPlant(nickname, date_watered, harvest_status, id, user_id);

  if (!updated) {
    return res.status(404).json({ error: "Plant not found for this user" });
  }

  const formatted = formatUserPlant(updated);
  res.json(formatted);
});



// Delete a plant for user
const deletePlant = asyncHandler(async (req, res) => {
  console.log("Deleting plant...");
  const user_id = req.user.id;
  const { id } = req.params;  // id of the user_plant entry
    const result = await deleteUserPlant(id, user_id);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Plant not found for this user" });
    }
    res.json({ success: true, message: "Plant deleted successfully" });
});


module.exports = { getPlants, getPlantById, createPlant, updatePlant, deletePlant, searchPlants };
