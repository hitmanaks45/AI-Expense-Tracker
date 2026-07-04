import { useState, useMemo } from "react";
import { HiPlus, HiSearch } from "react-icons/hi";
import ExpenseTable from "../components/ExpenseTable";
import ExpenseForm from "../components/ExpenseForm";
import Modal from "../components/Modal";
import Button from "../components/Button";
import { useExpenses } from "../context/ExpenseContext";
import { categories } from "../utils/dummyData";
import { formatCurrency, calcTotal } from "../utils/helpers";

const Expenses = () => {
  const { expenses, loading, error, addExpense, updateExpense, deleteExpense } = useExpenses();

  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [submitError, setSubmitError] = useState("");

  const filtered = useMemo(() => {
    return expenses.filter((exp) => {
      const matchesSearch = exp.title.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = filterCategory === "All" || exp.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [expenses, search, filterCategory]);

  const handleAddSubmit = async (formData) => {
    try {
      setSubmitError("");
      await addExpense(formData);
      setIsModalOpen(false);
    } catch (err) {
      setSubmitError(err.message || "Unable to add expense");
    }
  };

  const handleEditSubmit = async (formData) => {
    try {
      setSubmitError("");
      await updateExpense(editingExpense.id, formData);
      setEditingExpense(null);
    } catch (err) {
      setSubmitError(err.message || "Unable to update expense");
    }
  };

  const handleDelete = async (id) => {
    await deleteExpense(id);
    setDeleteConfirm(null);
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Expenses</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {expenses.length} total - {formatCurrency(calcTotal(expenses))} spent
          </p>
        </div>
        <Button onClick={() => { setSubmitError(""); setIsModalOpen(true); }} icon={<HiPlus size={16} />}>
          Add Expense
        </Button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
      {loading && <p className="text-sm text-gray-500 dark:text-gray-400">Loading expenses...</p>}

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <HiSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search expenses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9"
          />
        </div>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="input-field sm:w-48"
        >
          <option value="All">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {(search || filterCategory !== "All") && (
        <p className="text-xs text-gray-400 -mt-2">
          Showing {filtered.length} of {expenses.length} expenses
          {filterCategory !== "All" ? ` in "${filterCategory}"` : ""}
        </p>
      )}

      <div className="card">
        <ExpenseTable
          expenses={filtered}
          onEdit={(expense) => { setSubmitError(""); setEditingExpense(expense); }}
          onDelete={(id) => setDeleteConfirm(id)}
        />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Expense">
        {submitError && <p className="mb-4 text-sm text-red-500">{submitError}</p>}
        <ExpenseForm onSubmit={handleAddSubmit} onCancel={() => setIsModalOpen(false)} />
      </Modal>

      <Modal isOpen={!!editingExpense} onClose={() => setEditingExpense(null)} title="Edit Expense">
        {submitError && <p className="mb-4 text-sm text-red-500">{submitError}</p>}
        <ExpenseForm
          initialData={editingExpense}
          onSubmit={handleEditSubmit}
          onCancel={() => setEditingExpense(null)}
        />
      </Modal>

      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Expense">
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-5">
          Are you sure you want to delete this expense? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
          <Button variant="danger" onClick={() => handleDelete(deleteConfirm)}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
};

export default Expenses;

