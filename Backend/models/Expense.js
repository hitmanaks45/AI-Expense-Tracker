const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Short title shown in tables/cards
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Food",
        "Transport",
        "Shopping",
        "Entertainment",
        "Bills",
        "Healthcare",
        "Education",
        "Travel",
        "Other",
      ],
    },

    // Detailed description (optional)
    description: {
      type: String,
      trim: true,
      maxlength: 300,
    },
    merchant: {
  type: String,
  default: "",
},

source: {
  type: String,
  enum: ["manual", "ocr"],
  default: "manual",
},

    paymentMethod: {
      type: String,
      enum: [
        "Cash",
        "UPI",
        "Credit Card",
        "Debit Card",
        "Net Banking",
        "Other",
      ],
      default: "UPI",
    },

    // Future AI support
    tags: [
      {
        type: String,
      },
    ],

    // Future recurring expense support
    isRecurring: {
      type: Boolean,
      default: false,
    },

    recurringType: {
      type: String,
      enum: ["Daily", "Weekly", "Monthly", "Yearly"],
      default: null,
    },

    // Future receipt upload
    receipt: {
      type: String,
      default: "",
    },

    // Future restore functionality
    isDeleted: {
      type: Boolean,
      default: false,
    },

    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Expense", expenseSchema);