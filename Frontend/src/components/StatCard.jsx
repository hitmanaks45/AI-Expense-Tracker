// StatCard — displays a single financial metric

const StatCard = ({ title, value, icon, trend, trendLabel, colorClass = 'text-primary-600' }) => {
  return (
    <div className="card flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</span>
        {icon && (
          <span className={`p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50 ${colorClass}`}>
            {icon}
          </span>
        )}
      </div>
      <div>
        <p className={`text-2xl font-bold ${colorClass}`}>{value}</p>
        {trendLabel && (
          <p className={`text-xs mt-1 ${trend === 'up' ? 'text-accent-600' : trend === 'down' ? 'text-red-500' : 'text-gray-400'}`}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : ''} {trendLabel}
          </p>
        )}
      </div>
    </div>
  );
};

export default StatCard;
