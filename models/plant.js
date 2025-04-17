const pool = require("../config/db");

// Catalog plant queries
const getAllCatalogPlants = () => {
  return pool.query("SELECT * FROM catalog_plant");
};

const getCatalogPlantById = (id) => {
  return pool.query("SELECT * FROM catalog_plant WHERE id = $1", [id]);
};

const searchCatalogPlants = (query) => {
  return pool.query(
    "SELECT * FROM catalog_plant WHERE common_name ILIKE $1",
    [`%${query}%`]
  );
};

// User plant queries
const findPlantsByUser = (userId) => {
  return pool.query(`
    SELECT 
      user_plant.id AS user_plant_id,
      user_plant.nickname,
      user_plant.user_id,
      user_plant.garden_id,
      user_plant.plant_id,
      user_plant.date_added,
      user_plant.date_watered,
      user_plant.harvest_status,
      catalog_plant.id AS catalog_plant_id,
      catalog_plant.common_name,
      catalog_plant.scientific_name,
      catalog_plant.width,
      catalog_plant.height,
      catalog_plant.min_temperature,
      catalog_plant.max_temperature,
      catalog_plant.planting_start,
      catalog_plant.planting_end,
      catalog_plant.blooming_start,
      catalog_plant.blooming_end,
      catalog_plant.flower_color,
      catalog_plant.harvest_start,
      catalog_plant.harvest_end,
      catalog_plant.edible_parts,
      catalog_plant.yield,
      catalog_plant.sun_light,
      catalog_plant.water_frequency,
      catalog_plant.feeding_frequency,
      catalog_plant.fertilizer_type
    FROM user_plant
    JOIN catalog_plant ON user_plant.plant_id = catalog_plant.id
    WHERE user_plant.user_id = $1
  `, [userId]);
};


const createUserPlant = (nickname, plant_id, user_id, garden_id) => {
  return pool.query(
    "INSERT INTO user_plant (nickname, plant_id, user_id, garden_id, date_added) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP) RETURNING *",
    [nickname, plant_id, user_id, garden_id]
  );
};

const updateUserPlant = (nickname, date_watered, harvest_status, id, user_id) => {
  return pool.query(
    "UPDATE user_plant SET nickname = $1, date_watered = $2, harvest_status = $3 WHERE id = $4 AND user_id = $5 RETURNING *",
    [nickname, date_watered, harvest_status, id, user_id]
  );
};

const deleteUserPlant = (id, user_id) => {
  return pool.query(
    "DELETE FROM user_plant WHERE id = $1 AND user_id = $2 RETURNING *",
    [id, user_id]
  );
};

module.exports = {
  getAllCatalogPlants,
  getCatalogPlantById,
  searchCatalogPlants,
  findPlantsByUser,
  createUserPlant,
  updateUserPlant,
  deleteUserPlant,
};
