const express = require("express");
const { getMonthlySummary } = require("../controllers/analyticsController");
const authMiddleware = require("../middlewares/authMiddleware");
const { getFinancialScore } = require("../controllers/analyticsController");
const { getMonthlyTrend } = require("../controllers/analyticsController");
const { getAIInsights } = require("../controllers/insightsController");
const router = express.Router();


router.get("/monthly-summary", authMiddleware, getMonthlySummary);
router.get("/financial-score", authMiddleware, getFinancialScore);
router.get("/monthly-trend", authMiddleware, getMonthlyTrend);


// Add this to your existing routes
router.get("/ai-coach", authMiddleware, getAIInsights);
module.exports = router;