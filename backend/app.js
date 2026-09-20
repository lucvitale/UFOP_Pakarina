const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const { logger, morganMiddleware } = require("./config/logger");

const healthRouter = require("./routes/health.routes");
const apiRouter = require("./routes/api.routes");
const errorHandler = require("./middlewares/errorHandler");
const authRouter = require("./routes/auth.routes");
const newsRoutes = require("./routes/news.routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morganMiddleware);

app.use("/api/health", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api", newsRoutes);
app.use("/api/sensor", require("./routes/sensor.routes"));
app.use("/api", apiRouter);


/* =========================================================
   CONTACT
   ========================================================= */

app.post("/api/contact", (req, res) => {
  try {
    const {
      name,
      email,
      institution,
      subject,
      message,
    } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        message: "Name, email, subject and message are required.",
      });
    }

    const clean = (value) =>
      String(value)
        .replace(/\r/g, "")
        .replace(/\n/g, " ")
        .trim();

    const entry = `
--------------------------------------------------
CONTACT MESSAGE
Date: ${new Date().toLocaleString("en-US")}
Name: ${clean(name)}
Email: ${clean(email)}
Institution: ${clean(institution || "Not provided")}
Subject: ${clean(subject)}
Message:
${clean(message)}
--------------------------------------------------

`;

    const dataDir = path.join(__dirname, "data");
    const filePath = path.join(dataDir, "contact_messages.txt");

    fs.mkdirSync(dataDir, { recursive: true });

    fs.appendFileSync(filePath, entry, "utf8");

    console.log(
      `[INFO] Contact message received from ${clean(name)}`
    );

    res.status(201).json({
      message: "Message saved successfully.",
    });

  } catch (error) {
    console.error("[ERROR] Contact message:", error);

    res.status(500).json({
      message: "Unable to save contact message.",
    });
  }
});


/* =========================================================
   STATIC FRONTEND
   ========================================================= */

app.use(express.static(path.join(__dirname, "../frontend")));


/* =========================================================
   404
   ========================================================= */

app.use((req, res) => {
  logger.warn("Route not found", {
    method: req.method,
    url: req.originalUrl
  });

  res.status(404).json({
    error: "Route not found"
  });
});


/* =========================================================
   ERROR HANDLER
   ========================================================= */

app.use(errorHandler);

module.exports = app;