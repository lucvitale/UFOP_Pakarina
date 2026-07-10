const express = require("express");
const router = express.Router();
const {
  getNewsByCity,
  getNewsBySearch,
  getNewsNearby,
  getAvailableCities,
} = require("../controllers/news.controller");

// GET /api/news?city=Rio
router.get("/news", getNewsByCity);

// GET /api/news/search?q=dengue
router.get("/news/search", getNewsBySearch);

// GET /api/news/nearby?lat=-22.90&lon=-43.17&radius=50
router.get("/news/nearby", getNewsNearby);

// GET /api/news/cities
router.get("/news/cities", getAvailableCities);

module.exports = router;