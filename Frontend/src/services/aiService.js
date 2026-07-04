import api from "../utils/api";

export const analyzeExpenses = async (message, history) => {
  const response = await api.post("/api/ai/analyze", {
    message,
    history,
  });

  return response.data;
};