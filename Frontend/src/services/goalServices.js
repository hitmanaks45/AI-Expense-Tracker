import api from "../utils/api";

export const generateGoalPlan = async (goalData) => {
  const response = await api.post("/api/goals", goalData);
  return response.data;
};