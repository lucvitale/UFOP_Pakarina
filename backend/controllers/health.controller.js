const db = require("../config/db");

const check = async (req, res) => {
  const health = {
    status: "ok",
    message: "Pakarina API is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  };

  try {
    await db.query("SELECT 1");
    health.database = "connected";
  } catch (err) {
    health.database = "disconnected";
    health.dbError = err.message;
  }

  res.json(health);
};

module.exports = { check };
