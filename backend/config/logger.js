const fs = require("fs");
const path = require("path");
const morgan = require("morgan");

const logsDir = path.join(__dirname, "../logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

const LEVELS = { INFO: "INFO", WARN: "WARN", ERROR: "ERROR" };

function formatEntry(level, message, meta = {}) {
  return JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    message,
    ...meta,
  });
}

function writeToFile(filename, content) {
  fs.appendFileSync(path.join(logsDir, filename), content + "\n", "utf8");
}

const logger = {
  info(message, meta) {
    const entry = formatEntry(LEVELS.INFO, message, meta);
    console.log(`[INFO]  ${message}`);
    writeToFile("app.log", entry);
  },
  warn(message, meta) {
    const entry = formatEntry(LEVELS.WARN, message, meta);
    console.warn(`[WARN]  ${message}`);
    writeToFile("app.log", entry);
  },
  error(message, meta) {
    const entry = formatEntry(LEVELS.ERROR, message, meta);
    console.error(`[ERROR] ${message}`);
    writeToFile("error.log", entry);
    writeToFile("app.log", entry);
  },
};

const httpStream = fs.createWriteStream(path.join(logsDir, "http.log"), {
  flags: "a",
});

const morganMiddleware = morgan(
  (tokens, req, res) => {
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      method: tokens.method(req, res),
      url: tokens.url(req, res),
      status: tokens.status(req, res),
      responseTime: tokens["response-time"](req, res) + "ms",
      ip: req.ip,
    });
  },
  { stream: httpStream }
);

module.exports = { logger, morganMiddleware };
