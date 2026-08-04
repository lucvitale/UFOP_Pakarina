require("dotenv").config();
const mysql = require("mysql2/promise");
const { Client } = require("ssh2");
const net = require("net");
const fs = require("fs");

let pool = null;
let sshClient = null;
let localProxyServer = null;
let localProxyPort = null;

function connectSSH() {
  return new Promise((resolve, reject) => {
    const ssh = new Client();
    ssh.on("ready", () => resolve(ssh));
    ssh.on("error", reject);
    ssh.connect({
      host: "200.239.155.206",
      port: 22,
      username: "ubuntu",
      privateKey: fs.readFileSync(process.env.SSH_KEY_PATH),
      keepaliveInterval: 10000,
      keepaliveCountMax: 10,
    });
  });
}

// Crée un serveur TCP local : chaque connexion entrante (= chaque
// connexion ouverte par le pool MySQL) obtient SON PROPRE canal SSH.
function startLocalProxy(ssh) {
  return new Promise((resolve, reject) => {
    const server = net.createServer((socket) => {
      ssh.forwardOut("127.0.0.1", 0, "127.0.0.1", 3306, (err, stream) => {
        if (err) {
          socket.destroy();
          return;
        }
        socket.pipe(stream).pipe(socket);
        stream.on("error", () => socket.destroy());
        socket.on("error", () => stream.destroy());
      });
    });

    server.listen(0, "127.0.0.1", () => {
      resolve(server);
    });
    server.on("error", reject);
  });
}

async function getPool() {
  if (pool) {
    try {
      const conn = await pool.getConnection();
      await conn.ping();
      conn.release();
      return pool;
    } catch {
      pool = null;
    }
  }

  if (!sshClient) {
    sshClient = await connectSSH();
    sshClient.on("error", () => { sshClient = null; pool = null; });
    sshClient.on("end", () => { sshClient = null; pool = null; });
    sshClient.on("close", () => { sshClient = null; pool = null; });
  }

  if (!localProxyServer) {
    localProxyServer = await startLocalProxy(sshClient);
    localProxyPort = localProxyServer.address().port;
  }

  pool = mysql.createPool({
    host: "127.0.0.1",
    port: localProxyPort,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    waitForConnections: true,
    connectionLimit: 10,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,
  });

  return pool;
}

module.exports = { getPool };