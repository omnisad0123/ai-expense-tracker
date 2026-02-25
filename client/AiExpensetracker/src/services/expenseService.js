import api from "./api";

export const addExpense = async (data) => {
  const response = await api.post("/expenses", data);
  return response.data;
};

export const getExpenses = async () => {
  const response = await api.get("/expenses");
  return response.data;
};