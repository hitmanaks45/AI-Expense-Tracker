import { useState } from "react";
import Input from "./Input";
import Button from "./Button";
import { categories, paymentMethods } from "../utils/dummyData";
import { getTodayString } from "../utils/helpers";

const ExpenseForm = ({ initialData, onSubmit, onCancel }) => {
  const [form, setForm] = useState({
    title: initialData?.title || "",
    amount: initialData?.amount || "",
    category: initialData?.category || categories[0],
    paymentMethod: initialData?.paymentMethod || "UPI",
    date: initialData?.date || getTodayString(),
    note: initialData?.note || "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) {
      newErrors.amount = "Enter a valid amount";
    }
    if (!form.date) newErrors.date = "Date is required";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Title"
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="e.g. Grocery Shopping"
        required
        error={errors.title}
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Amount (INR)"
          name="amount"
          type="number"
          value={form.amount}
          onChange={handleChange}
          placeholder="0.00"
          required
          error={errors.amount}
        />
        <Input
          label="Date"
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          required
          error={errors.date}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="input-field"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Payment Method
          </label>
          <select
            name="paymentMethod"
            value={form.paymentMethod}
            onChange={handleChange}
            className="input-field"
          >
            {paymentMethods.map((method) => (
              <option key={method} value={method}>{method}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description (optional)</label>
        <textarea
          name="note"
          value={form.note}
          onChange={handleChange}
          placeholder="Add a description..."
          rows={2}
          className="input-field resize-none"
        />
      </div>

      <div className="flex justify-end gap-2 pt-1">
        <Button variant="secondary" onClick={onCancel} type="button">Cancel</Button>
        <Button type="submit">{initialData ? "Save Changes" : "Add Expense"}</Button>
      </div>
    </form>
  );
};

export default ExpenseForm;
