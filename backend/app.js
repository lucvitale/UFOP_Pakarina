const express = require("express");
const cors = require("cors");
const { logger, morganMiddleware } = require("./config/logger");

const healthRouter = require("./routes/health.routes");
const apiRouter = require("./routes/api.routes");
const errorHandler = require("./middlewares/errorHandler");
const authRouter = require("./routes/auth.routes");
const newsRoutes = require('./routes/news.routes');

const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morganMiddleware);

app.use("/api/health", healthRouter);
app.use("/api/auth", authRouter);
app.use('/api', newsRoutes);
app.use("/api", apiRouter);


app.use((req, res) => {
  logger.warn("Route not found", { method: req.method, url: req.originalUrl });
  res.status(404).json({ error: "Route not found" });
});

app.use(errorHandler);

const path = require("path");
app.use(express.static(path.join(__dirname, "../frontend")));


module.exports = app;
