const pool = require("../config/db");

// Find all gardens by user ID
const findGardenByUser = (userId) => {
  return pool.query("SELECT * FROM garden WHERE user_id = $1", [userId]);
};

// Create a new garden
const insertGarden = (userId, name) => {
  return pool.query(
    "INSERT INTO garden (user_id, name) VALUES ($1, $2) RETURNING *",
    [userId, name]
  );
};

// Update a garden
const updateGardenById = (name, id, userId) => {
  return pool.query(
    "UPDATE garden SET name = $1 WHERE id = $2 AND user_id = $3 RETURNING *",
    [name, id, userId]
  );
};

// Delete a garden
const deleteGardenById = (id, userId) => {
  return pool.query(
    "DELETE FROM garden WHERE id = $1 AND user_id = $2 RETURNING *",
    [id, userId]
  );
};

module.exports = {
  findGardenByUser,
  insertGarden,
  updateGardenById,
  deleteGardenById,
};
