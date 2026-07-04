const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  generateGoalPlan,
} = require("../controllers/goalController");

router.post("/", protect, generateGoalPlan);

module.exports = router;