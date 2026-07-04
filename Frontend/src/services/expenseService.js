import api from "../utils/api";

export const saveExpense = async (expense) => {
  const response = await api.post("/api/expenses", expense);
  return response.data;
};