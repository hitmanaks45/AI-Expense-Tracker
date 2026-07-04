// Utility functions for Smart Expense Tracker

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(Number(amount || 0));
};

export const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const getTodayString = () => {
  return new Date().toISOString().split("T")[0];
};

export const calcTotal = (arr) => {
  return arr.reduce((sum, item) => sum + Number(item.amount || 0), 0);
};

export const groupByCategory = (expenseList) => {
  const grouped = {};
  expenseList.forEach((exp) => {
    if (!grouped[exp.category]) {
      grouped[exp.category] = 0;
    }
    grouped[exp.category] += Number(exp.amount || 0);
  });
  return Object.entries(grouped).map(([name, value]) => ({ name, value: Number(value.toFixed(2)) }));
};

export const getInitials = (name = "") => {
  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

export const getCategoryClass = (category) => {
  const map = {
    Food: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    Transport: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
    Shopping: "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300",
    Entertainment: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
    Bills: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
    Healthcare: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    Education: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300",
    Travel: "bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300",
    Other: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
  };
  return map[category] || map.Other;
};

