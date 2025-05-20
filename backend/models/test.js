const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: [true, "Please enter the question"],
  },
  options: {
    type: [String],
    validate: {
      validator: function (arr) {
        return arr.length === 4;
      },
      message: "There must be exactly 4 options",
    },
    required: [true, "Please enter options"],
  },
  answer: {
    type: String,
    required: [true, "Please enter the correct answer"],
    validate: {
      validator: function (value) {
        return this.options.includes(value);
      },
      message: "Answer must be one of the provided options",
    },
  },
});

const testSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please enter Exam name"],
    },
    category: {
      type: String,
      required: [true, "Please enter category"],
    },
    typeOfTest:{
      type: String,
      required: [true, "Please enter Type of Test"],
    },
    questions: {
      type: [questionSchema],
      required: [true, "Please add at least one question"],
    },
    timeDuration: {
      type: Number,
      required: [true, "Please define the time duration of the test"],
      min: [1, "Time duration must be at least 1 minute"],
    },
    marksCorrect: {
      type: Number,
      required: [true, "Please define marks for correct answers"],
      min: [1, "Marks for correct answer must be at least 1"],
    },
    marksWrong: {
      type: Number,
      required: [true, "Please define negative marks for incorrect answers"],
      min: [0, "Negative marks cannot be less than 0"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Test", testSchema);
