const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  addExpense,
  getExpenses,
  getExpense,
  updateExpense,
  removeExpense,
} = require("../controllers/expenseController");

const router = express.Router();

router.route("/")
  .post(protect, addExpense)
  .get(protect, getExpenses);

router.route("/:id")
  .get(protect, getExpense)
  .put(protect, updateExpense)
  .delete(protect, removeExpense);

module.exports = router;