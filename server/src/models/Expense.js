const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      default: "Uncategorized",
    },
    date: {
      type: Date,
      default: Date.now,
    },
    paymentMode: {
      type: String,
      enum: ["cash", "upi", "card"],
      default: "upi",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Expense", expenseSchema);
