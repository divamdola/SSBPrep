// models/TestAttempt.js
const mongoose = require("mongoose");

const testAttemptSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
    test: { type: mongoose.Schema.ObjectId, ref: "Test", required: true },
    answers: [
      {
        question: { type: String, required: true },
        selectedOption: { type: String, required: true, default: "Not Attempted" },
        isCorrect: { type: Boolean, required: true, default: false },
      },
    ],
    score: { type: Number, required: true, default: 0 },
    totalQuestions: { type: Number, required: true, default: 0 },
    correctAnswers: { type: Number, required: true, default: 0 },
    wrongAnswers: { type: Number, required: true, default: 0 },
    timeTaken: { type: Number, required: true, default: 0 }, // in seconds
    attemptedAt: { type: Date, default: Date.now },

    // 👇 New fields
    paused: { type: Boolean, default: false },
    currentQuestionIndex: { type: Number, default: 0 },
    timeLeft: { type: Number, default: 0 },
  },
  { timestamps: true }
);


module.exports = mongoose.model("TestAttempt", testAttemptSchema);
