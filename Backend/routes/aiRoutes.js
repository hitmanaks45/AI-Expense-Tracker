const express = require("express");

const router = express.Router();

const { analyzeExpenses } = require("../controllers/aiController");
const protect = require("../middleware/authMiddleware");

router.post("/analyze", protect, analyzeExpenses);

module.exports = router;