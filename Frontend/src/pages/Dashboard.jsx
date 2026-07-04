import { HiCash, HiChartBar, HiReceiptRefund, HiTrendingDown } from "react-icons/hi";
import {
  PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid
} from "recharts";
import StatCard from "../components/StatCard";
import ChartCard from "../components/ChartCard";
import ExpenseTable from "../components/ExpenseTable";
import BudgetCard from "../components/BudgetCard";
import { useAuth } from "../context/AuthContext";
import { useExpenses } from "../context/ExpenseContext";
import { categoryColors } from "../utils/dummyData";
import { formatCurrency, groupByCategory } from "../utils/helpers";

const monthLabel = (date) =>
  new Date(date).toLocaleDateString("en-US", { month: "short" });

const buildMonthlyExpenses = (expenses) => {
  const grouped = expenses.reduce((acc, expense) => {
    const key = monthLabel(expense.date);
    acc[key] = (acc[key] || 0) + Number(expense.amount || 0);
    return acc;
  }, {});

  return Object.entries(grouped).map(([month, amount]) => ({
    month,
    amount: Number(amount.toFixed(2)),
  }));
};

const isThisMonth = (date) => {
  const expenseDate = new Date(date);
  const now = new Date();
  return expenseDate.getMonth() === now.getMonth() && expenseDate.getFullYear() === now.getFullYear();
};

const Dashboard = () => {
  const { user } = useAuth();
  const { expenses, budget, loading, error, totalExpenses } = useExpenses();

  const monthlyExpenses = buildMonthlyExpenses(expenses);
  const thisMonthTotal = expenses
    .filter((expense) => isThisMonth(expense.date))
    .reduce((sum, expense) => sum + expense.amount, 0);
  const recentTransactions = [...expenses].slice(0, 5);
  const pieData = groupByCategory(expenses);

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.name?.split(" ")[0] || "there"}!
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          Here's a summary based on your saved expenses.
        </p>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
      {loading && <p className="text-sm text-gray-500 dark:text-gray-400">Loading expenses...</p>}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Expenses"
          value={formatCurrency(totalExpenses)}
          icon={<HiTrendingDown size={18} />}
          colorClass="text-red-500"
          trendLabel="All time"
          trend="down"
        />
        <StatCard
          title="This Month"
          value={formatCurrency(thisMonthTotal)}
          icon={<HiChartBar size={18} />}
          colorClass="text-primary-600"
          trendLabel="Current month"
        />
        <StatCard
          title="Transactions"
          value={expenses.length}
          icon={<HiReceiptRefund size={18} />}
          colorClass="text-orange-500"
          trendLabel="Saved in MongoDB"
        />
        <StatCard
          title="Budget Left"
          value={formatCurrency(budget.remaining)}
          icon={<HiCash size={18} />}
          colorClass={budget.remaining >= 0 ? "text-accent-600" : "text-red-500"}
          trendLabel="Monthly budget"
        />
      </div>

      <BudgetCard
        monthly={budget.monthly}
        spent={budget.spent}
        remaining={budget.remaining}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Expenses by Category">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {pieData.map((entry) => (
                  <Cell key={entry.name} fill={categoryColors[entry.name] || "#6B7280"} />
                ))}
              </Pie>
              <Tooltip formatter={(val) => formatCurrency(val)} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Monthly Expenses">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyExpenses} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(val) => formatCurrency(val)} />
              <Bar dataKey="amount" fill="#2563EB" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Recent Transactions</h3>
          <a href="/expenses" className="text-xs text-primary-600 hover:underline">View all</a>
        </div>
        <ExpenseTable expenses={recentTransactions} compact />
      </div>
    </div>
  );
};

export default Dashboard;
