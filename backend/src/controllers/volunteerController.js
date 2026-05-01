const Student = require("../models/Student");
const VolunteerQuestion = require("../models/VolunteerQuestion");

const pickVolunteerForCollege = async (collegeCode) => {
  const volunteers = await Student.find({ collegeCode, isVolunteer: true })
    .select("_id name email")
    .sort({ createdAt: 1 });

  if (!volunteers.length) {
    return null;
  }

  const volunteerLoads = await Promise.all(
    volunteers.map(async (volunteer) => {
      const load = await VolunteerQuestion.countDocuments({
        assignedVolunteer: volunteer._id,
        status: { $in: ["open", "assigned"] }
      });

      return { volunteer, load };
    })
  );

  volunteerLoads.sort((left, right) => left.load - right.load);
  return volunteerLoads[0].volunteer;
};

exports.submitQuestion = async (req, res) => {
  try {
    const student = await Student.findById(req.student.id).select("name email collegeCode");
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    const { question } = req.body;
    if (!question || !question.trim()) {
      return res.status(400).json({ success: false, message: "Question is required" });
    }

    const assignedVolunteer = await pickVolunteerForCollege(student.collegeCode);

    const volunteerQuestion = await VolunteerQuestion.create({
      student: student._id,
      collegeCode: student.collegeCode,
      question: question.trim(),
      assignedVolunteer: assignedVolunteer ? assignedVolunteer._id : null,
      status: assignedVolunteer ? "assigned" : "open"
    });

    const populatedQuestion = await VolunteerQuestion.findById(volunteerQuestion._id)
      .populate("student", "name email")
      .populate("assignedVolunteer", "name email")
      .lean();

    res.status(201).json({
      success: true,
      question: populatedQuestion,
      message: assignedVolunteer
        ? "Question sent to your assigned volunteer"
        : "Question saved. Assign a volunteer to start replies."
    });
  } catch (error) {
    console.error("Submit volunteer question error:", error);
    res.status(500).json({ success: false, message: "Failed to submit question" });
  }
};

exports.getStudentQuestions = async (req, res) => {
  try {
    const questions = await VolunteerQuestion.find({ student: req.student.id })
      .populate("student", "name email collegeCode")
      .populate("assignedVolunteer", "name email")
      .populate("replies.volunteer", "name email")
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, questions });
  } catch (error) {
    console.error("Get student volunteer questions error:", error);
    res.status(500).json({ success: false, message: "Failed to load questions" });
  }
};

exports.getVolunteerInbox = async (req, res) => {
  try {
    const questions = await VolunteerQuestion.find({ assignedVolunteer: req.volunteer._id })
      .populate("student", "name email collegeCode")
      .populate("assignedVolunteer", "name email")
      .populate("replies.volunteer", "name email")
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, questions });
  } catch (error) {
    console.error("Get volunteer inbox error:", error);
    res.status(500).json({ success: false, message: "Failed to load assigned questions" });
  }
};

exports.replyToQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const { reply } = req.body;

    if (!reply || !reply.trim()) {
      return res.status(400).json({ success: false, message: "Reply is required" });
    }

    const question = await VolunteerQuestion.findById(questionId);
    if (!question) {
      return res.status(404).json({ success: false, message: "Question not found" });
    }

    if (String(question.assignedVolunteer) !== String(req.volunteer._id)) {
      return res.status(403).json({ success: false, message: "This question is assigned to another volunteer" });
    }

    question.replies.push({
      volunteer: req.volunteer._id,
      content: reply.trim()
    });
    question.status = "answered";
    await question.save();

    const updatedQuestion = await VolunteerQuestion.findById(question._id)
      .populate("student", "name email")
      .populate("assignedVolunteer", "name email")
      .populate("replies.volunteer", "name email")
      .lean();

    res.json({
      success: true,
      question: updatedQuestion,
      message: "Reply sent successfully"
    });
  } catch (error) {
    console.error("Reply to volunteer question error:", error);
    res.status(500).json({ success: false, message: "Failed to send reply" });
  }
};