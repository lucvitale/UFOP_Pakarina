const jwt = require("jsonwebtoken");
const { logger } = require("../config/logger");

function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    logger.warn("Unauthorized access attempt", { url: req.originalUrl });
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    logger.warn("Invalid token", { url: req.originalUrl });
    return res.status(403).json({ error: "Invalid or expired token." });
  }
}

module.exports = authMiddleware;