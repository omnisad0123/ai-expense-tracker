import api from "./api";

export const getMonthlySummary = async () => {
  const response = await api.get("/analytics/monthly-summary");
  return response.data;
};
export const getFinancialScore = async () => {
  const response = await api.get("/analytics/financial-score");
  return response.data;
};
export const getMonthlyTrend = async () => {
  const response = await api.get("/analytics/monthly-trend");
  return response.data;
};
// Add this to your existing analyticsService.js
export const getAiCoachInsights = async () => {
  const response = await api.get("/analytics/ai-coach"); // Ensure this matches your backend route
  return response.data;
};