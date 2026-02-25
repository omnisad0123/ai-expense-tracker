const Expense = require("../models/Expense");
const { categorizeExpense } = require("../services/aiExpenseService");

// Add a new expense with AI categorization
exports.addExpense = async (req, res) => {
  try {
    const { amount, description, date, paymentMode } = req.body;
    // FIX: Using req.user.id to match your authMiddleware
    const userId = req.user.id;

    let category = "Other";

    try {
      // Calling the Gemini-powered service
      category = await categorizeExpense(description);
    } catch (err) {
      console.log("AI categorization failed, defaulting to 'Other'");
    }

    const expense = await Expense.create({
      user: userId,
      amount,
      description,
      category,
      date: date || Date.now(), // Fallback to current date
      paymentMode,
    });

    res.status(201).json(expense);
  } catch (error) {
    console.error("Expense Creation Error:", error);
    res.status(500).json({ message: "Error saving expense" });
  }
};

// Get all expenses for the logged-in user
exports.getExpenses = async (req, res) => {
  try {
    // FIX: Using req.user.id to match your authMiddleware
    const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    console.error("Expense Fetch Error:", error);
    res.status(500).json({ message: "Error fetching expenses" });
  }
};