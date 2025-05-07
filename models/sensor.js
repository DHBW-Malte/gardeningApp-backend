const pool = require("../config/db");

exports.findAllSensors = () => {
  return pool.query("SELECT * FROM moisture_Sensor ORDER BY date_added DESC");
};

exports.findSensorById = (id) => {
  return pool.query("SELECT * FROM moisture_Sensor WHERE id = $1", [id]);
};

exports.insertSensor = (user_id, name, moisture) => {
  return pool.query(
    "INSERT INTO moisture_Sensor (user_id, name, current_moisture_level, date_added) VALUES ($1, $2, $3, CURRENT_TIMESTAMP) RETURNING *",
    [user_id, name, moisture]
  );
};

exports.updateSensor = (id, name, moisture) => {
  return pool.query(
    "UPDATE moisture_Sensor SET name = $1, current_moisture_level = $2 WHERE id = $3 RETURNING *",
    [name, moisture, id]
  );
};

exports.deleteSensor = (id) => {
  return pool.query("DELETE FROM moisture_Sensor WHERE id = $1 RETURNING *", [id]);
};

exports.insertSensorData = (moisture, id) => {
  return pool.query(
    "UPDATE moisture_Sensor SET current_moisture_level = $1 WHERE id = $2 RETURNING *",
    [moisture, id]
  );
};