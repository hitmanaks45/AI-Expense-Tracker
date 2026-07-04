const Expense = require("../models/Expense");

const getDashboardData = async (userId) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

  const result = await Expense.aggregate([
    {
      $match: {
        user: userId,
      },
    },
    {
      $facet: {
        summary: [
          {
            $group: {
              _id: null,
              totalExpenses: { $sum: "$amount" },
              totalTransactions: { $sum: 1 },
            },
          },
        ],

        todayExpenses: [
          {
            $match: {
              date: { $gte: today },
            },
          },
          {
            $group: {
              _id: null,
              amount: { $sum: "$amount" },
            },
          },
        ],

        thisMonthExpenses: [
          {
            $match: {
              date: { $gte: firstDay },
            },
          },
          {
            $group: {
              _id: null,
              amount: { $sum: "$amount" },
            },
          },
        ],

        categoryBreakdown: [
          {
            $group: {
              _id: "$category",
              amount: {
                $sum: "$amount",
              },
            },
          },
          {
            $sort: {
              amount: -1,
            },
          },
        ],

        monthlyTrend: [
          {
            $group: {
              _id: {
                year: { $year: "$date" },
                month: { $month: "$date" },
              },
              amount: {
                $sum: "$amount",
              },
            },
          },
          {
            $sort: {
              "_id.year": 1,
              "_id.month": 1,
            },
          },
        ],

        recentExpenses: [
          {
            $sort: {
              date: -1,
            },
          },
          {
            $limit: 5,
          },
        ],
      },
    },
  ]);

  const data = result[0];

  return {
    summary: {
      totalExpenses: data.summary[0]?.totalExpenses || 0,
      totalTransactions: data.summary[0]?.totalTransactions || 0,
      todayExpenses: data.todayExpenses[0]?.amount || 0,
      thisMonthExpenses: data.thisMonthExpenses[0]?.amount || 0,
    },

    categoryBreakdown: data.categoryBreakdown,

    monthlyTrend: data.monthlyTrend,

    recentExpenses: data.recentExpenses,
  };
};

module.exports = {
  getDashboardData,
};