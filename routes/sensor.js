const express = require("express");
const router = express.Router();
const { storeSensorData } = require("../controllers/sensor");

router.post("/data", storeSensorData);

module.exports = router;