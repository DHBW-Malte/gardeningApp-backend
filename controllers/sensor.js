const asyncHandler = require("express-async-handler");
const sensorModel = require("../models/sensor");
const jwt = require("jsonwebtoken");

exports.pairSensor = asyncHandler(async (req, res) => {
  const { name, user_id, current_moisture_level } = req.body;

  const result = await sensorModel.insertSensor(user_id, name, current_moisture_level);
  const sensor = result.rows[0];

  const token = jwt.sign(
    { sensorId: sensor.id, user_id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.status(201).json({
    message: "Sensor paired successfully",
    token,
    sensor,
  });
});

exports.submitSensorData = asyncHandler(async (req, res) => {
  const { moisture } = req.body;
  const { id } = req.sensor;

  const result = await sensorModel.insertSensorData(moisture, id);

  res.status(201).json({ success: true, data: result.rows[0] });
});

exports.getAllSensors = asyncHandler(async (req, res) => {
  const result = await sensorModel.findAllSensors();
  res.json(result.rows);
});

exports.getSensorById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await sensorModel.findSensorById(id);
  if (result.rows.length === 0) return res.status(404).json({ error: "Sensor not found" });
  res.json(result.rows[0]);
});

exports.createSensor = asyncHandler(async (req, res) => {
  const { user_id, name, current_moisture_level } = req.body;
  const result = await sensorModel.insertSensor(user_id, name, current_moisture_level);
  res.status(201).json(result.rows[0]);
});

exports.updateSensor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, current_moisture_level } = req.body;
  const result = await sensorModel.updateSensor(id, name, current_moisture_level);
  if (result.rows.length === 0) return res.status(404).json({ error: "Sensor not found" });
  res.json(result.rows[0]);
});

exports.deleteSensor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await sensorModel.deleteSensor(id);
  if (result.rows.length === 0) return res.status(404).json({ error: "Sensor not found" });
  res.json({ message: "Sensor deleted" });
});
