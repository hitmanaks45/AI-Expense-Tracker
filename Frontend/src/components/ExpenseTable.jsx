import { HiPencil, HiTrash } from "react-icons/hi";
import { formatCurrency, formatDate, getCategoryClass } from "../utils/helpers";

const ExpenseTable = ({ expenses, onEdit, onDelete, compact = false }) => {
  if (expenses.length === 0) {
    return (
      <div className="text-center py-10 text-gray-400 dark:text-gray-500">
        <p className="text-sm">No expenses found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 pb-3 pr-4">Title</th>
            <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 pb-3 pr-4">Category</th>
            {!compact && (
              <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 pb-3 pr-4">Payment</th>
            )}
            <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 pb-3 pr-4">Date</th>
            <th className="text-right text-xs font-semibold text-gray-500 dark:text-gray-400 pb-3 pr-4">Amount</th>
            {!compact && (
              <th className="text-right text-xs font-semibold text-gray-500 dark:text-gray-400 pb-3">Actions</th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
          {expenses.map((exp) => (
            <tr
              key={exp.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
            >
              <td className="py-3 pr-4">
                <p className="font-medium text-gray-800 dark:text-gray-200">{exp.title}</p>
                {exp.note && !compact && (
                  <p className="text-xs text-gray-400 mt-0.5 max-w-xs truncate" title={exp.note}>{exp.note}</p>
                )}
              </td>
              <td className="py-3 pr-4">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getCategoryClass(exp.category)}`}>
                  {exp.category}
                </span>
              </td>
              {!compact && (
                <td className="py-3 pr-4 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                  {exp.paymentMethod || "UPI"}
                </td>
              )}
              <td className="py-3 pr-4 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                {formatDate(exp.date)}
              </td>
              <td className="py-3 pr-4 text-right font-semibold text-gray-800 dark:text-gray-200 whitespace-nowrap">
                {formatCurrency(exp.amount)}
              </td>
              {!compact && (
                <td className="py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(exp)}
                        className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-md transition-colors"
                        title="Edit"
                      >
                        <HiPencil size={15} />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(exp.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition-colors"
                        title="Delete"
                      >
                        <HiTrash size={15} />
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExpenseTable;
