const express = require("express");
const router = express.Router();
const sensorController = require("../controllers/sensor.controller");

router.get("/readings", sensorController.getReadings);
router.get("/summary", sensorController.getSummary);

module.exports = router;
