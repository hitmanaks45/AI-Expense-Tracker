const asyncHandler = require("../utils/asyncHandler");
const expenseService = require("../services/expenseService");

// Add Expense
const addExpense = asyncHandler(async (req, res) => {
  const expense = await expenseService.createExpense({
    ...req.body,
    user: req.user._id,
  });

  res.status(201).json(expense);
});

// Get All Expenses
const getExpenses = asyncHandler(async (req, res) => {
  const expenses = await expenseService.getUserExpenses(req.user._id);

  res.status(200).json(expenses);
});

// Get Single Expense
const getExpense = asyncHandler(async (req, res) => {
  const expense = await expenseService.getExpenseById(
    req.params.id,
    req.user._id
  );

  if (!expense) {
    return res.status(404).json({
      message: "Expense not found",
    });
  }

  res.status(200).json(expense);
});

// Update Expense
const updateExpense = asyncHandler(async (req, res) => {
  const expense = await expenseService.updateExpense(
    req.params.id,
    req.user._id,
    req.body
  );

  if (!expense) {
    return res.status(404).json({
      message: "Expense not found",
    });
  }

  res.status(200).json(expense);
});

// Delete Expense
const removeExpense = asyncHandler(async (req, res) => {
  const expense = await expenseService.deleteExpense(
    req.params.id,
    req.user._id
  );

  if (!expense) {
    return res.status(404).json({
      message: "Expense not found",
    });
  }

  res.status(200).json({
    message: "Expense deleted successfully",
  });
});

module.exports = {
  addExpense,
  getExpenses,
  getExpense,
  updateExpense,
  removeExpense,
};