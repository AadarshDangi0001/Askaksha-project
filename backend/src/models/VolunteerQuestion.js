const mongoose = require("mongoose");

const VolunteerReplySchema = new mongoose.Schema({
  volunteer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true
  },
  content: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const VolunteerQuestionSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true
  },
  collegeCode: {
    type: String,
    required: true,
    index: true
  },
  question: {
    type: String,
    required: true
  },
  assignedVolunteer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    default: null
  },
  status: {
    type: String,
    enum: ["open", "assigned", "answered"],
    default: "open"
  },
  replies: [VolunteerReplySchema]
}, {
  timestamps: true
});

VolunteerQuestionSchema.index({ collegeCode: 1, status: 1, createdAt: -1 });
VolunteerQuestionSchema.index({ student: 1, createdAt: -1 });
VolunteerQuestionSchema.index({ assignedVolunteer: 1, createdAt: -1 });

module.exports = mongoose.model("VolunteerQuestion", VolunteerQuestionSchema);