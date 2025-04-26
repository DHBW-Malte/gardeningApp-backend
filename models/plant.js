const pool = require("../config/db");

// Catalog plant queries
const getAllCatalogPlants = () => {
  return pool.query("SELECT * FROM catalog_plant");
};

const getCatalogPlantById = (id) => {
  return pool.query("SELECT * FROM catalog_plant WHERE id = $1", [id]);
};

const searchCatalogPlants = async (query) => {
  console.log("Executing query with:", query);
  try {
    const res = await pool.query(
      "SELECT * FROM catalog_plant WHERE common_name ILIKE $1",
      [`%${query}%`]
    );
    return res;
  } catch (error) {
    console.error("Error querying catalog_plant:", error);
    throw error;
  }
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

const getFullUserPlantById = async (id, user_id = null) => {
  const whereClause = user_id
    ? 'WHERE user_plant.id = $1 AND user_plant.user_id = $2'
    : 'WHERE user_plant.id = $1';

  const values = user_id ? [id, user_id] : [id];

  const result = await pool.query(`
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
    ${whereClause}
  `, values);

  return result.rows[0];
};

const createUserPlant = async (nickname, plant_id, user_id, garden_id) => {
  const result = await pool.query(
    "INSERT INTO user_plant (nickname, plant_id, user_id, garden_id, date_added) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP) RETURNING id",
    [nickname, plant_id, user_id, garden_id]
  );
  return getFullUserPlantById(result.rows[0].id);
};

const updateUserPlant = async (fieldsToUpdate, id, user_id) => {
  const allowedFields = ["nickname", "garden_id", "date_watered", "harvest_status"];
  const setClauses = [];
  const values = [];
  let index = 1;

  for (const field of allowedFields) {
    if (fieldsToUpdate[field] !== undefined) {
      setClauses.push(`${field} = $${index}`);
      values.push(fieldsToUpdate[field]);
      index++;
    }
  }

  if (setClauses.length === 0) {
    throw new Error("No valid fields provided for update");
  }

  values.push(id, user_id);

  const query = `
    UPDATE user_plant 
    SET ${setClauses.join(", ")}
    WHERE id = $${index} AND user_id = $${index + 1}
    RETURNING *;
  `;

  const result = await pool.query(query, values);
  return result.rows[0];
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
