require("dotenv").config();
const { getPool } = require("./config/db");
const app = require("./app");
const { logger } = require("./config/logger");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`Pakarina API started`, {
    url: `http://localhost:${PORT}`,
    environment: process.env.NODE_ENV || "development",
  });
  console.log(`🚀 Pakarina API running on http://localhost:${PORT}`);
  getPool()
  .then(() => logger.info("MySQL connected via SSH tunnel"))
  .catch((err) => logger.error("MySQL connection failed", { error: err.message }));
});
