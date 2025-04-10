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
  createUserPlant,
  updateUserPlant,
  deleteUserPlant,
};
