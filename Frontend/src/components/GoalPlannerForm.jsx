import { useState } from "react";
import { generateGoalPlan } from "../services/goalServices";

const GoalPlannerForm = () => {
  const [goal, setGoal] = useState("");
  const [amount, setAmount] = useState("");
  const [months, setMonths] = useState("");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = await generateGoalPlan({
        goal,
        amount: Number(amount),
        months: Number(months),
      });

      setResult(data.response);
    } catch (error) {
      console.error(error);
      setResult("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="card max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-2 font-medium">
              Goal Name
            </label>

            <input
              className="input-field w-full"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="Buy iPhone 17 Pro"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Goal Amount (₹)
            </label>

            <input
              type="number"
              className="input-field w-full"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Target Time (Months)
            </label>

            <input
              type="number"
              className="input-field w-full"
              value={months}
              onChange={(e) => setMonths(e.target.value)}
              required
            />
          </div>

          <button
            className="btn-primary w-full"
            disabled={loading}
          >
            {loading ? "Generating Plan..." : "Generate AI Plan"}
          </button>
        </form>
      </div>

      {result && (
        <div className="card mt-8 whitespace-pre-wrap">
          <h2 className="text-xl font-bold mb-4">
            AI Goal Plan
          </h2>

          <div>{result}</div>
        </div>
      )}
    </>
  );
};

export default GoalPlannerForm;