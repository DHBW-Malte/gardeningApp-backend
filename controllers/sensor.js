const asyncHandler = require("express-async-handler");
const { insertSensorData } = require("../models/sensor");

const storeSensorData = asyncHandler(async (req, res) => {
  const { sensorId, moisture_level, timestamp } = req.body;
  await insertSensorData(sensorId, moisture_level, timestamp);
  res.status(201).json({ success: true });
});

module.exports = { storeSensorData };