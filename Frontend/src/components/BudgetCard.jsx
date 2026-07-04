import { formatCurrency } from '../utils/helpers';

// BudgetCard — shows budget usage with a progress bar

const BudgetCard = ({ monthly, spent, remaining }) => {
  const percentage = Math.min(Math.round((spent / monthly) * 100), 100);
  const isOverBudget = spent > monthly;

  const progressColor = isOverBudget
    ? 'bg-red-500'
    : percentage > 80
    ? 'bg-yellow-500'
    : 'bg-accent-600';

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Monthly Budget</h3>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${isOverBudget ? 'bg-red-100 text-red-600' : 'bg-accent-50 text-accent-700'}`}>
          {isOverBudget ? 'Over Budget' : `${percentage}% used`}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mb-4">
        <div
          className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Budget</p>
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{formatCurrency(monthly)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Spent</p>
          <p className="text-sm font-semibold text-red-600">{formatCurrency(spent)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Left</p>
          <p className={`text-sm font-semibold ${isOverBudget ? 'text-red-500' : 'text-accent-600'}`}>
            {formatCurrency(Math.abs(remaining))}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BudgetCard;
