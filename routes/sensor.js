const express = require("express");
const router = express.Router();
const sensor = require("../controllers/sensor");
const verifySensorToken = require("../middleware/sensor");
const authenticateJWT = require("../middleware/auth");

// Specific routes FIRST
router.post("/sensor/refresh-token", sensor.refreshSensorToken);
router.get("/sensor/:id/details", authenticateJWT, sensor.getSensorWithHistory);

// Pairing and data
router.post("/pair", sensor.pairSensor);
router.post("/data", verifySensorToken, sensor.submitSensorData);

// CRUD routes
router.get("/sensor", sensor.getAllSensors);
router.get("/sensor/:id", sensor.getSensorById);
router.post("/sensor", sensor.createSensor);
router.put("/sensor/:id", sensor.updateSensor);
router.delete("/sensor/:id", sensor.deleteSensor);


module.exports = router;