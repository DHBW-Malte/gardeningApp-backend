const pool = require("../config/db");

const insertSensorData = (sensorId, moisture_level, timestamp) => {
  return pool.query(
    "INSERT INTO sensor_data (sensor_id, moisture_level, timestamp) VALUES ($1, $2, $3)",
    [sensorId, moisture_level, timestamp]
  );
};

module.exports = { insertSensorData };