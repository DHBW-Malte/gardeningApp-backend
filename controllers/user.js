const asyncHandler = require("express-async-handler");
const {findUserById,createUser,updateUser,findGardensByUser} = require("../models/user");
const {findPlantsByUser} = require("../models/plant");

// Get User Profile
const getUserProfile = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await findUserById(id);

  if (result.rows.length === 0) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json(result.rows[0]);
});

// Create User Profile
const createUserProfile = asyncHandler(async (req, res) => {
  const { username, email } = req.body;
  const result = await createUser(username, email);
  res.json(result.rows[0]);
});

// Update User Profile
const updateUserProfile = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { username, email } = req.body;
  const result = await updateUser(username, email, id);
  res.json(result.rows[0]);
});


// Get all plants for a user
const getUserPlants = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const result = await findPlantsByUser(userId);

  const userPlants = result.rows.map(row => ({
    id: row.user_plant_id,
    nickName: row.nickname,
    userId: row.user_id,
    garden_id: row.garden_id,
    catalogPlant_id: row.catalog_plant_id,
    wateredDate: row.date_watered,
    plantedDate: row.date_added,
    feededDate: row.date_feed, // Optional field
    moistureLevel: row.moisture_level,
    sunlightLevel: row.sunlight_level,
    harvested: row.harvest_status,

    name: {
      commonName: row.common_name,
      scientificName: row.scientific_name
    },

    blooming: {
      start: row.blooming_start,
      end: row.blooming_end,
      flowerColor: row.flower_color
    },

    waterFrequency: row.water_frequency,
    sunLight: row.sun_light,

    harvest: (row.harvest_start && row.harvest_end && row.yield != null && row.edible_parts)
      ? {
          start: row.harvest_start,
          end: row.harvest_end,
          yield: row.yield,
          edibleParts: row.edible_parts
        }
      : null,

    temperature: {
      min: row.min_temperature,
      max: row.max_temperature
    },

    size: {
      height: row.height,
      width: row.width
    },

    fertilizerType: row.fertilizer_type,

    planting: {
      start: row.planting_start,
      end: row.planting_end
    },

    imageUrl: row.image_url
  }));

  res.json(userPlants);
});


// Get all gardens for a user
const getUserGardens = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await findGardensByUser(id);
  res.json(result.rows);
});

module.exports = {getUserProfile,createUserProfile,updateUserProfile, getUserPlants, getUserGardens};
