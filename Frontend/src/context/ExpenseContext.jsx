import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import api from "../utils/api";
import { useAuth } from "./AuthContext";

const ExpenseContext = createContext(null);

const initialBudget = {
  monthly: 2500,
};

const toDateInputValue = (date) => {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
};

const normalizeExpense = (expense) => ({
  ...expense,
  id: expense._id || expense.id,
  title: expense.title || expense.description || expense.category,
  note: expense.note || expense.description || "",
  paymentMethod: expense.paymentMethod || "UPI",
  date: toDateInputValue(expense.date),
  amount: Number(expense.amount || 0),
});

const toApiPayload = (expense) => {
  const title = expense.title?.trim() || expense.description?.trim() || expense.category;

  return {
    title,
    amount: Number(expense.amount),
    category: expense.category,
    description: expense.note?.trim() || expense.description?.trim() || title,
    paymentMethod: expense.paymentMethod || "UPI",
    date: expense.date,
  };
};

export const ExpenseProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [budget, setBudget] = useState(
    () => JSON.parse(localStorage.getItem("budget") || "null") || initialBudget
  );

  const fetchExpenses = useCallback(async () => {
    if (!isAuthenticated) {
      setExpenses([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const { data } = await api.get("/api/expenses");
      setExpenses(data.map(normalizeExpense));
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load expenses");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const addExpense = async (expenseData) => {
    try {
      setError("");
      const { data } = await api.post("/api/expenses", toApiPayload(expenseData));
      setExpenses((prev) => [normalizeExpense(data), ...prev]);
      return normalizeExpense(data);
    } catch (err) {
      const message = err.response?.data?.message || "Unable to add expense";
      setError(message);
      throw new Error(message);
    }
  };

  const updateExpense = async (id, updatedExpense) => {
    try {
      setError("");
      const { data } = await api.put(`/api/expenses/${id}`, toApiPayload(updatedExpense));
      const normalized = normalizeExpense(data);

      setExpenses((prev) =>
        prev.map((expense) => (expense.id === id ? normalized : expense))
      );
      return normalized;
    } catch (err) {
      const message = err.response?.data?.message || "Unable to update expense";
      setError(message);
      throw new Error(message);
    }
  };

  const deleteExpense = async (id) => {
    setError("");
    await api.delete(`/api/expenses/${id}`);
    setExpenses((prev) => prev.filter((expense) => expense.id !== id));
  };

  const totalExpenses = useMemo(
    () => expenses.reduce((sum, expense) => sum + expense.amount, 0),
    [expenses]
  );

  const currentBudget = useMemo(() => {
    const monthly = Number(budget.monthly || 0);
    const spent = Number(totalExpenses.toFixed(2));

    return {
      monthly,
      spent,
      remaining: Number((monthly - spent).toFixed(2)),
    };
  }, [budget.monthly, totalExpenses]);

  const updateBudget = (newBudget) => {
    const updatedBudget = {
      monthly: Number(newBudget),
    };

    setBudget(updatedBudget);
    localStorage.setItem("budget", JSON.stringify(updatedBudget));
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        budget: currentBudget,
        loading,
        error,
        totalExpenses,
        fetchExpenses,
        addExpense,
        updateExpense,
        deleteExpense,
        updateBudget,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = () => {
  const context = useContext(ExpenseContext);

  if (!context) {
    throw new Error("useExpenses must be used within ExpenseProvider");
  }

  return context;
};


