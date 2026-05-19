require("dotenv").config({ path: "../.env" });
const mysql = require("mysql2/promise");

async function init() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
  });

  await conn.query(
    `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`
     CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
  );

  console.log(`✅ Database '${process.env.DB_NAME}' created (or already exists)`);
  await conn.end();
}

init().catch((err) => {
  console.error("❌ DB init failed:", err.message);
  process.exit(1);
});
