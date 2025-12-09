const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Admin Signup
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ msg: "Please fill all fields" });
    }

    let admin = await Admin.findOne({ email });
    if (admin) {
      return res.status(400).json({ msg: "Email already exists" });
    }

    const hashedPass = await bcrypt.hash(password, 10);

    // Generate unique college code
    const collegeCode = "CLG" + Math.random().toString(36).substring(2, 8).toUpperCase();

    admin = await Admin.create({ name, email, password: hashedPass, collegeCode });
    res.status(201).json({ 
      msg: "Account created successfully", 
      collegeCode,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email
      }
    });
  } catch (error) {
    console.error('Admin signup error:', error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// Admin Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ msg: "Please provide email and password" });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign(
      { admin: { id: admin._id } }, 
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({ 
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        collegeCode: admin.collegeCode
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// Get Admin Info
exports.getAdminInfo = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select("-password");
    res.json(admin);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// Get Dashboard Stats
exports.getDashboard = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select("-password");
    if (!admin) {
      return res.status(404).json({ msg: "Admin not found" });
    }

    // Get college details
    const College = require('../models/College');
    const college = await College.findOne({ adminId: req.admin.id });

    // Get chat logs from last 24 hours
    const Message = require('../models/Message');
    const Student = require('../models/Student');
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    // Find students by collegeCode (not adminId)
    const students = await Student.find({ collegeCode: admin.collegeCode }).select('_id name email');
    const studentIds = students.map(s => s._id);
    
    const recentMessages = await Message.find({
      user: { $in: studentIds },
      createdAt: { $gte: twentyFourHoursAgo }
    })
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .limit(100);

    res.json({
      adminName: admin.name,
      email: admin.email,
      collegeCode: admin.collegeCode,
      college: college,
      recentChats: recentMessages
    });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};
