const Student = require("../models/Student");
const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const collegeService = require("../services/collegeService");

// Student Signup
exports.signup = async (req, res) => {
  try {
    const { name, email, password, collegeCode } = req.body;
    
    if (!name || !email || !password || !collegeCode) {
      return res.status(400).json({ msg: "Please fill all fields" });
    }

    let student = await Student.findOne({ email });
    if (student) {
      return res.status(400).json({ msg: "Email already exists" });
    }

    const admin = await Admin.findOne({ collegeCode });
    if (!admin) {
      return res.status(400).json({ msg: "Invalid college code" });
    }

    const hashedPass = await bcrypt.hash(password, 10);

    student = await Student.create({ name, email, password: hashedPass, collegeCode });
    res.status(201).json({ 
      msg: "Account created successfully",
      student: {
        id: student._id,
        name: student.name,
        email: student.email
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// Student Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ msg: "Please provide email and password" });
    }

    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign(
      { student: { id: student._id } }, 
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({ 
      token,
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        collegeCode: student.collegeCode
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// Get Student Dashboard Info
exports.getDashboard = async (req, res) => {
  try {
    const student = await Student.findById(req.student.id).select("-password");
    
    const admin = await Admin.findOne({ collegeCode: student.collegeCode });
    const college = await collegeService.getCollegeByAdminId(admin._id);
    
    res.json({
      studentName: student.name,
      collegeName: college ? college.name : "College",
      collegeCode: student.collegeCode,
      college: college || null
    });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};
