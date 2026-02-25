const mongoose = require("mongoose");
const Expense = require("../models/Expense");
const Budget = require("../models/Budget");

// 1. Monthly Summary (Pie Chart Data)
exports.getMonthlySummary = async (req, res) => {
  try {
    // FIX: Using req.user.id to match your authMiddleware
    const userObjectId = new mongoose.Types.ObjectId(req.user.id);

    // Filter logic for "This Month"
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const result = await Expense.aggregate([
      {
        $match: {
          user: userObjectId,
          date: { $gte: startOfMonth }, // Only get current month data
        },
      },
      {
        $group: {
          _id: "$category",
          totalAmount: { $sum: "$amount" },
        },
      },
      {
        $sort: { totalAmount: -1 },
      },
    ]);

    const total = await Expense.aggregate([
      {
        $match: {
          user: userObjectId,
          date: { $gte: startOfMonth },
        },
      },
      {
        $group: {
          _id: null,
          totalSpent: { $sum: "$amount" },
        },
      },
    ]);

    res.json({
      totalSpent: total[0]?.totalSpent || 0,
      categoryBreakdown: result,
    });
  } catch (err) {
    console.error("Aggregation Error:", err);
    res.status(500).json({ message: "Error generating summary" });
  }
};

// 2. Financial Health Score
exports.getFinancialScore = async (req, res) => {
  try {
    const userObjectId = new mongoose.Types.ObjectId(req.user.id);

    const expenses = await Expense.aggregate([
      {
        $match: { user: userObjectId },
      },
      {
        $group: {
          _id: "$category",
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);

    const budgets = await Budget.find({ user: req.user.id });

    let score = 100;

    expenses.forEach((expense) => {
      const budget = budgets.find((b) => b.category === expense._id);

      if (budget) {
        const usagePercent = (expense.totalAmount / budget.limit) * 100;
        // Logic: Overspending reduces score
        if (usagePercent > 100) score -= 20;
        else if (usagePercent > 80) score -= 10;
      }
    });

    if (score < 0) score = 0;

    res.json({ financialScore: score });
  } catch (err) {
    console.error("Score Error:", err);
    res.status(500).json({ message: "Error calculating score" });
  }
};

// 3. Monthly Trend (Bar Chart Data)
exports.getMonthlyTrend = async (req, res) => {
  try {
    const userObjectId = new mongoose.Types.ObjectId(req.user.id);
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const result = await Expense.aggregate([
      { $match: { user: userObjectId } },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" }
          },
          total: { $sum: "$amount" }
        }
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1
        }
      }
    ]);

    // Format for Recharts: { name: "Feb", total: 4500 }
    const formatted = result.map(item => ({
      name: monthNames[item._id.month - 1], 
      total: item.total
    }));

    res.json(formatted);

  } catch (err) {
    console.error("Trend Error:", err);
    res.status(500).json({ message: "Monthly trend error" });
  }
};