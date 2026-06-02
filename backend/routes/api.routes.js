const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/hello", (req, res) => {
  res.json({
    message: "Hello from Pakarina API 🦟",
    project: "Pakarina — UFOP Dengue Monitoring",
    version: "1.0.0",
  });
});

router.get("/protected", authMiddleware, (req, res) => {
  res.json({
    message: "Access granted to protected route",
    user: req.user,
  });
});

module.exports = router;
