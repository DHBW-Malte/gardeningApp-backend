const asyncHandler = require("express-async-handler");
const sensorModel = require("../models/sensor");

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
