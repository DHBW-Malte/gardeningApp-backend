const express = require("express");
const router = express.Router();
const sensor = require("../controllers/sensor");
const verifySensorToken = require("../middleware/sensor");

router.post("/pair", sensor.pairSensor);
router.get("/sensor", sensor.getAllSensors);
router.get("/sensor/:id", sensor.getSensorById);
router.post("/sensor", sensor.createSensor);
router.put("/sensor/:id", sensor.updateSensor);
router.delete("/sensor/:id", sensor.deleteSensor);
router.post("/data", verifySensorToken, sensor.submitSensorData);

module.exports = router;