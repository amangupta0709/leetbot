const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  solved_by: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    required: true,
  },
  difficulty: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Question = mongoose.model("Question", QuestionSchema);

module.exports = Question;