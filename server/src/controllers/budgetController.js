const Budget = require("../models/Budget");

// Set or update budget
exports.setBudget = async (req, res) => {
  try {
    const { category, limit } = req.body;
    // FIX: Using req.user.id to match your authMiddleware
    const userId = req.user.id;

    const budget = await Budget.findOneAndUpdate(
      { user: userId, category },
      { limit },
      { new: true, upsert: true } // Creates a new one if it doesn't exist
    );

    res.json(budget);
  } catch (error) {
    console.error("Budget Error:", error);
    res.status(500).json({ message: "Error setting budget" });
  }
};

// Get all budgets for the logged-in user
exports.getBudgets = async (req, res) => {
  try {
    // FIX: Using req.user.id to match your authMiddleware
    const budgets = await Budget.find({ user: req.user.id });
    res.json(budgets);
  } catch (error) {
    console.error("Budget Fetch Error:", error);
    res.status(500).json({ message: "Error fetching budgets" });
  }
};