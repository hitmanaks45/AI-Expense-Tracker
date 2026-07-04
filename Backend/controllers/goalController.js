const Expense = require("../models/Expense");
const { generateResponse } = require("../services/aiService");

const generateGoalPlan = async (req, res) => {
  try {
    const userId = req.user._id;

    const { goal, amount, months } = req.body;

    const expenses = await Expense.find({ user: userId });

    if (!expenses.length) {
      return res.status(200).json({
        success: true,
        response:
          "You don't have enough expense data. Add some expenses first.",
      });
    }

    // Calculate total spent
    const totalSpent = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    // Category-wise spending
    const categoryTotals = {};

    expenses.forEach((expense) => {
      categoryTotals[expense.category] =
        (categoryTotals[expense.category] || 0) + expense.amount;
    });

    const categorySummary = Object.entries(categoryTotals)
      .map(([category, amount]) => `${category}: ₹${amount}`)
      .join("\n");

    const monthlyRequired = (amount / months).toFixed(2);

    const prompt = `
You are an expert AI Financial Planner.

The user wants to achieve this goal:

Goal: ${goal}

Goal Amount: ₹${amount}

Target Time: ${months} months

The user must save approximately ₹${monthlyRequired} every month.

Current spending summary:

${categorySummary}

Total Spending: ₹${totalSpent}

Your task:

1. Tell whether this goal is realistic.

2. Mention which spending categories should be reduced.

3. Estimate how much should be reduced from each category.

4. Give a practical monthly budget.

5. Give an estimated success probability.

6. End with motivational advice.

Use headings and bullet points.
Keep the answer under 300 words.
`;

    const aiResponse = await generateResponse(prompt);

    res.json({
      success: true,
      response: aiResponse,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to generate goal plan",
    });
  }
};

module.exports = {
  generateGoalPlan,
};