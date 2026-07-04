const Expense = require("../models/Expense");
const { generateResponse } = require("../services/aiService");

const analyzeExpenses = async (req, res) => {
  try {
    const userId = req.user._id;

    const {
      message,
      history = [],
    } = req.body;

    // Fetch all expenses of the logged-in user
    const expenses = await Expense.find({ user: userId }).sort({
      date: -1,
    });

    if (expenses.length === 0) {
      return res.status(200).json({
        success: true,
        response:
          "You don't have any expenses yet. Add some expenses first so I can analyze your spending.",
      });
    }

    // Convert expenses into text
    const expenseData = expenses
      .map(
        (expense) =>
          `Category: ${expense.category}, Amount: ₹${expense.amount}, Description: ${expense.description}, Date: ${new Date(
            expense.date
          ).toDateString()}`
      )
      .join("\n");

    // Build previous conversation
    const conversationHistory = history
      .map(
        (msg) =>
          `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`
      )
      .join("\n");

    // Prompt for Gemini
    const prompt = `
You are an expert AI Financial Advisor.

Your job is to help users understand and improve their finances.

=========================
PREVIOUS CONVERSATION
=========================

${conversationHistory}

=========================
CURRENT USER QUESTION
=========================

${message}

=========================
USER'S EXPENSE DATA
=========================

${expenseData}

=========================
INSTRUCTIONS
=========================

1. Continue the conversation naturally.

2. Remember previous messages.

3. If the user asks follow-up questions like:
- Why?
- Explain more.
- How?
- What do you mean?
- Can you elaborate?

Use the previous conversation to answer.

4. Only use the expense data provided.

5. Never invent transactions.

6. If asked about:
- spending analysis
- highest category
- budgeting
- saving money
- expense trends

answer using the expense data.

7. If the question is unrelated to finance, politely tell the user that you only answer finance-related questions.

Keep the answer:
- Friendly
- Personalized
- Professional
- Under 250 words.
`;

    // Generate AI response
    const aiResponse = await generateResponse(prompt);

    return res.status(200).json({
      success: true,
      response: aiResponse,
    });
  } catch (error) {
    console.error("AI Controller Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate AI response.",
    });
  }
};

module.exports = {
  analyzeExpenses,
};