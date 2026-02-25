const Expense = require("../models/Expense");
const Budget = require("../models/Budget");
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.getAIInsights = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Fetch recent data (Last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const expenses = await Expense.find({
      user: userId,
      date: { $gte: thirtyDaysAgo },
    }).sort({ date: -1 });

    const budgets = await Budget.find({ user: userId });

    if (expenses.length === 0) {
      return res.json({ insight: "You haven't logged any expenses in the last 30 days. Start tracking to get AI insights!" });
    }

    // 2. Prepare a summary for Gemini
    const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const categoryTotals = expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {});

    const budgetStatus = budgets.map(b => ({
      category: b.category,
      limit: b.limit,
      spent: categoryTotals[b.category] || 0
    }));

    // 3. Construct the AI Prompt
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `
  Analyze this user's 30-day spending:
  - Total Spent: ₹${totalSpent}
  - Category Breakdown: ${JSON.stringify(categoryTotals)}
  - Budget Status: ${JSON.stringify(budgetStatus)}

  STRICT RULES:
  1. Provide exactly 3 bullet points.
  2. Each bullet point MUST be under 15 words.
  3. Be blunt and actionable (e.g., "Cut Zomato by 20% to save ₹2k").
  4. No introductory or concluding text.
`;

    // 4. Get Response from Gemini
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const insightText = response.text();

    res.json({ insight: insightText });
  } catch (error) {
    console.error("AI Insights Error:", error);
    res.status(500).json({ message: "The Financial Coach is currently offline. Try again later!" });
  }
};