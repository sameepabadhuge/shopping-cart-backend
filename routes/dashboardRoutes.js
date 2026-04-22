const express = require("express");
const router = express.Router();

const {
  getDashboardStats,
} = require("../controllers/dashboardController");

// GET Dashboard Stats
router.get("/", getDashboardStats);

module.exports = router;