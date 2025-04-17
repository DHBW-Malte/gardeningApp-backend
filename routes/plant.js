const express = require("express");
const router = express.Router();
const { 
  getPlants, 
  getPlantById,
  getUserPlants,
  createPlant, 
  updatePlant, 
  deletePlant,
  searchPlants
} = require("../controllers/plant");

// Get all plants
router.get("/plants", getPlants);

// Get a plant by ID
router.get("/plants/:id", getPlantById);

// Search plants by common name
router.get("/plants/search", searchPlants);

// Get all plants of a user
router.get("/:id/plants", getUserPlants);

// Create a new plant
router.post("/plants", createPlant);

// Update a plant
router.put("/plants/:id", updatePlant);

// Delete a plant
router.delete("/plants/:id", deletePlant);

module.exports = router;

