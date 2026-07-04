import {
  PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis,
  ResponsiveContainer, CartesianGrid, Legend
} from "recharts";
import ChartCard from "../components/ChartCard";
import StatCard from "../components/StatCard";
import { useExpenses } from "../context/ExpenseContext";
import { categoryColors } from "../utils/dummyData";
import { formatCurrency, groupByCategory, getCategoryClass } from "../utils/helpers";
import { HiTrendingDown, HiTrendingUp, HiChartBar } from "react-icons/hi";

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

const Analytics = () => {
  const { expenses, loading, error, totalExpenses } = useExpenses();

  const pieData = groupByCategory(expenses).sort((a, b) => b.value - a.value);
  const monthlyExpenses = buildMonthlyExpenses(expenses);
  const avgMonthly = monthlyExpenses.length
    ? Math.round(monthlyExpenses.reduce((s, m) => s + m.amount, 0) / monthlyExpenses.length)
    : 0;
  const highestMonth = monthlyExpenses.length
    ? monthlyExpenses.reduce((prev, curr) => (curr.amount > prev.amount ? curr : prev))
    : { month: "None", amount: 0 };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Analytics</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          Visual breakdown of your saved spending patterns.
        </p>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
      {loading && <p className="text-sm text-gray-500 dark:text-gray-400">Loading analytics...</p>}

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Total Spent"
          value={formatCurrency(totalExpenses)}
          icon={<HiTrendingDown size={18} />}
          colorClass="text-red-500"
          trendLabel="All saved expenses"
        />
        <StatCard
          title="Avg Monthly"
          value={formatCurrency(avgMonthly)}
          icon={<HiChartBar size={18} />}
          colorClass="text-primary-600"
          trendLabel="Based on saved months"
        />
        <StatCard
          title="Highest Month"
          value={`${highestMonth.month} (${formatCurrency(highestMonth.amount)})`}
          icon={<HiTrendingUp size={18} />}
          colorClass="text-orange-500"
          trendLabel="Saved data peak"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Expenses by Category">
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={90} dataKey="value">
                {pieData.map((entry) => (
                  <Cell key={entry.name} fill={categoryColors[entry.name] || "#6B7280"} />
                ))}
              </Pie>
              <Tooltip formatter={(val) => formatCurrency(val)} />
              <Legend formatter={(val) => <span className="text-xs">{val}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Monthly Expense Trend">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={monthlyExpenses} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(val) => formatCurrency(val)} />
              <Bar dataKey="amount" fill="#2563EB" radius={[4, 4, 0, 0]} name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="card">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Category Breakdown</h3>
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {pieData.map((cat) => (
            <div key={cat.name} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: categoryColors[cat.name] || "#6B7280" }}
                />
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getCategoryClass(cat.name)}`}>
                  {cat.name}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {totalExpenses ? ((cat.value / totalExpenses) * 100).toFixed(1) : 0}%
                </span>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 w-20 text-right">
                  {formatCurrency(cat.value)}
                </span>
              </div>
            </div>
          ))}
          {!pieData.length && (
            <p className="py-6 text-sm text-center text-gray-400 dark:text-gray-500">No expenses found.</p>
          )}
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700 mt-1">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Total</span>
          <span className="text-sm font-bold text-gray-900 dark:text-white">{formatCurrency(totalExpenses)}</span>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
