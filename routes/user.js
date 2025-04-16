const express = require("express");
const router = express.Router();
const { getUserProfile, createUserProfile, updateUserProfile, getUserGardens, getUserPlants } = require("../controllers/user");

// Get User Profile
router.get("/:id", getUserProfile);

// Create User Profile
router.post("/", createUserProfile);

// Update User Profile
router.put("/:id", updateUserProfile);

// Get all gardens of a user
router.get("/:id/gardens", getUserGardens);

// Get all plants of a user
router.get("/:id/plants", getUserPlants);

module.exports = router;
