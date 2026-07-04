const Expense = require("../models/Expense");

// Create Expense
const createExpense = async (expenseData) => {
  const expense = await Expense.create(expenseData);
  return expense;
};

// Get All Expenses of Logged-in User
const getUserExpenses = async (userId) => {
  return Expense.find({
  user: userId,
  isDeleted: false,
}).sort({ date: -1 });
};

// Get Single Expense
const getExpenseById = async (expenseId, userId) => {
  return Expense.findOne({
  _id: expenseId,
  user: userId,
  isDeleted: false,
});
};

// Update Expense
const updateExpense = async (expenseId, userId, updateData) => {
  return  Expense.findOneAndUpdate(
    {
      _id: expenseId,
      user: userId,
    },
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );
};

// Delete Expense
const deleteExpense = async (expenseId, userId) => {
  return Expense.findOneAndUpdate(
    {
      _id: expenseId,
      user: userId,
    },
    {
      isDeleted: true,
    },
    {
      new: true,
    }
  );
};

module.exports = {
  createExpense,
  getUserExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
};