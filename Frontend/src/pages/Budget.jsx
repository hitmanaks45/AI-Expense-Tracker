import { useState } from 'react';
import { HiPencil } from 'react-icons/hi';
import BudgetCard from '../components/BudgetCard';
import Modal from '../components/Modal';
import Button from '../components/Button';
import Input from '../components/Input';
import { useExpenses } from '../context/ExpenseContext';
import { formatCurrency, getCategoryClass, groupByCategory } from '../utils/helpers';

const Budget = () => {
  const { budget, expenses, updateBudget } = useExpenses();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBudget, setNewBudget] = useState(budget.monthly);
  const [error, setError] = useState('');

  const categoryBreakdown = groupByCategory(expenses).sort((a, b) => b.value - a.value);

  const handleSaveBudget = () => {
    const val = parseFloat(newBudget);
    if (!val || val <= 0) {
      setError('Please enter a valid budget amount');
      return;
    }
    updateBudget(val);
    setIsModalOpen(false);
    setError('');
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Budget</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Manage your monthly spending limit.
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={() => setIsModalOpen(true)}
          icon={<HiPencil size={14} />}
        >
          Edit Budget
        </Button>
      </div>

      {/* Budget overview card */}
      <BudgetCard
        monthly={budget.monthly}
        spent={budget.spent}
        remaining={budget.remaining}
      />

      {/* Spending by category */}
      <div className="card">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Spending by Category</h3>
        <div className="flex flex-col gap-3">
          {categoryBreakdown.map((cat) => {
            const pct = Math.min(Math.round((cat.value / budget.monthly) * 100), 100);
            return (
              <div key={cat.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getCategoryClass(cat.name)}`}>
                    {cat.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 dark:text-gray-500">{pct}% of budget</span>
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                      {formatCurrency(cat.value)}
                    </span>
                  </div>
                </div>
                <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${pct > 80 ? 'bg-red-500' : pct > 50 ? 'bg-yellow-500' : 'bg-primary-500'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tips */}
      <div className="card border-l-4 border-l-primary-600">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Budget Tips</h3>
        <ul className="text-sm text-gray-500 dark:text-gray-400 flex flex-col gap-1.5 list-disc list-inside">
          <li>Aim to keep expenses under 80% of your budget</li>
          <li>Set aside at least 20% of income for savings</li>
          <li>Review and adjust your budget monthly</li>
          <li>Track recurring subscriptions to avoid overspending</li>
        </ul>
      </div>

      {/* Edit Budget Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Set Monthly Budget">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Current budget: <strong className="text-gray-700 dark:text-gray-300">{formatCurrency(budget.monthly)}</strong>
          </p>
          <Input
            label="New Monthly Budget (INR)"
            type="number"
            value={newBudget}
            onChange={(e) => {
              setNewBudget(e.target.value);
              setError('');
            }}
            placeholder="e.g. 2500"
            error={error}
          />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveBudget}>Save Budget</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Budget;

