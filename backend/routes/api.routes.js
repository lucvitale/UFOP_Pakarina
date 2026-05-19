const express = require("express");
const router = express.Router();

router.get("/hello", (req, res) => {
  res.json({
    message: "Hello from Pakarina API 🦟",
    project: "Pakarina — UFOP Dengue Monitoring",
    version: "1.0.0",
  });
});

module.exports = router;
