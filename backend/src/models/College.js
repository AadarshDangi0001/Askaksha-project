const mongoose = require("mongoose");

const CollegeSchema = new mongoose.Schema({
  adminId: mongoose.Schema.Types.ObjectId,
  name: String,
  address: String,
  about: String,
  website: String,
  
  // Academic Information
  courses: [{ 
    name: String, 
    duration: String, 
    description: String 
  }],
  departments: [String],
  
  // Financial Information
  fees: {
    tuitionFee: String,
    hostelFee: String,
    examFee: String,
    otherFees: String
  },
  
  // Scholarship Information
  scholarships: [{
    name: String,
    eligibility: String,
    amount: String,
    deadline: String
  }],
  
  // Important Deadlines
  deadlines: [{
    event: String,
    date: String,
    description: String
  }],
  
  // Facilities
  facilities: [String],
  
  // Contact Information
  contactInfo: {
    email: String,
    phone: String,
    whatsapp: String,
    admissionOffice: String
  },
  
  // Additional Information
  establishedYear: String,
  accreditation: String,
  placement: {
    averagePackage: String,
    topRecruiters: [String],
    placementRate: String
  }
});

module.exports = mongoose.model("College", CollegeSchema);
