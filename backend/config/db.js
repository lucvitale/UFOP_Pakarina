require("dotenv").config({ path: "../.env" });
const mysql = require("mysql2/promise");
const { Client } = require("ssh2");

function createSSHTunnel() {
  return new Promise((resolve, reject) => {
    const ssh = new Client();

    ssh.on("ready", () => {
      ssh.forwardOut(
        "127.0.0.1", 0,
        "127.0.0.1", 3306,
        (err, stream) => {
          if (err) { ssh.end(); return reject(err); }
          resolve({ stream, ssh });
        }
      );
    });

    ssh.on("error", reject);

    ssh.connect({
      host: "200.239.155.206",
      port: 22,
      username: "ubuntu",
      privateKey: require("fs").readFileSync(process.env.SSH_KEY_PATH),
    });
  });
}

let pool;

async function getPool() {
  if (pool) return pool;

  const { stream, ssh } = await createSSHTunnel();

  pool = mysql.createPool({
    stream,
    host: "127.0.0.1",
    port: 3306,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    waitForConnections: true,
    connectionLimit: 10,
  });

  pool.on("end", () => ssh.end());
  return pool;
}

module.exports = { getPool };