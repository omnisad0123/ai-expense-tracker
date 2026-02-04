const Expense = require("../models/Expense");

// Add expense
exports.addExpense = async (req, res) => {
  const { amount, description, category, date, paymentMode } = req.body;

  const expense = await Expense.create({
    user: req.userId,
    amount,
    description,
    category,
    date,
    paymentMode,
  });

  res.status(201).json(expense);
};

// Get all expenses of logged-in user
exports.getExpenses = async (req, res) => {
  const expenses = await Expense.find({ user: req.userId }).sort({ date: -1 });
  res.json(expenses);
};
