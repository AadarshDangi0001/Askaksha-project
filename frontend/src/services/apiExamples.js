// Example usage of the API service in components

import { adminAPI, studentAPI, collegeAPI, chatbotAPI } from '../services/api';

// ============================================
// ADMIN EXAMPLES
// ============================================

// 1. Admin Registration
const handleAdminRegister = async () => {
  try {
    const data = await adminAPI.register('admin@college.com', 'password123');
    
    // Store token and admin info
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('adminInfo', JSON.stringify(data.data.admin));
    
    console.log('Admin registered:', data.data.admin);
    console.log('College Code:', data.data.admin.collegeCode);
    
  } catch (error) {
    console.error('Registration failed:', error.message);
  }
};

// 2. Admin Login
const handleAdminLogin = async () => {
  try {
    const data = await adminAPI.login('admin@college.com', 'password123');
    
    // Store credentials
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('adminInfo', JSON.stringify(data.data.admin));
    
    console.log('Login successful');
    
  } catch (error) {
    console.error('Login failed:', error.message);
  }
};

// 3. Get Admin Profile
const fetchAdminProfile = async () => {
  try {
    const data = await adminAPI.getProfile();
    console.log('Admin:', data.data.admin);
    console.log('College:', data.data.college);
  } catch (error) {
    console.error('Failed to fetch profile:', error.message);
  }
};

// 4. Change Password
const handleChangePassword = async () => {
  try {
    const data = await adminAPI.changePassword('oldPassword123', 'newPassword456');
    console.log('Password changed successfully');
  } catch (error) {
    console.error('Failed to change password:', error.message);
  }
};

// ============================================
// STUDENT EXAMPLES
// ============================================

// 1. Student Registration
const handleStudentRegister = async () => {
  try {
    const data = await studentAPI.register(
      'John Doe',
      'john@example.com',
      'password123',
      'CLG12345' // College code from admin
    );
    
    // Store credentials
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('studentInfo', JSON.stringify(data.data.student));
    localStorage.setItem('collegeInfo', JSON.stringify(data.data.college));
    
    console.log('Student registered:', data.data.student);
    console.log('College:', data.data.college);
    
  } catch (error) {
    console.error('Registration failed:', error.message);
  }
};

// 2. Student Login (college code NOT required - stored in student document)
const handleStudentLogin = async () => {
  try {
    const data = await studentAPI.login('john@example.com', 'password123');
    
    // Store credentials
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('studentInfo', JSON.stringify(data.data.student));
    localStorage.setItem('collegeInfo', JSON.stringify(data.data.college));
    
    console.log('Login successful');
    
  } catch (error) {
    console.error('Login failed:', error.message);
  }
};

// 3. Get Student Profile
const fetchStudentProfile = async () => {
  try {
    const data = await studentAPI.getProfile();
    console.log('Student:', data.data.student);
    console.log('College:', data.data.college);
  } catch (error) {
    console.error('Failed to fetch profile:', error.message);
  }
};

// ============================================
// COLLEGE EXAMPLES
// ============================================

// 1. Create College (Admin only)
const handleCreateCollege = async () => {
  try {
    const collegeData = {
      name: 'MIT College',
      address: '123 Main St',
      city: 'Mumbai',
      state: 'Maharashtra'
    };
    
    const data = await collegeAPI.create(collegeData);
    console.log('College created:', data.data.college);
    
  } catch (error) {
    console.error('Failed to create college:', error.message);
  }
};

// 2. Get All Colleges
const fetchAllColleges = async () => {
  try {
    const data = await collegeAPI.getAll();
    console.log('All colleges:', data.data.colleges);
  } catch (error) {
    console.error('Failed to fetch colleges:', error.message);
  }
};

// 3. Get College by Code
const fetchCollegeByCode = async (collegeCode) => {
  try {
    const data = await collegeAPI.getByCode(collegeCode);
    console.log('College:', data.data.college);
  } catch (error) {
    console.error('Failed to fetch college:', error.message);
  }
};

// 4. Update College
const handleUpdateCollege = async (collegeCode) => {
  try {
    const updates = {
      name: 'MIT College Updated',
      phone: '1234567890'
    };
    
    const data = await collegeAPI.update(collegeCode, updates);
    console.log('College updated:', data.data.college);
    
  } catch (error) {
    console.error('Failed to update college:', error.message);
  }
};

// 5. Delete College
const handleDeleteCollege = async (collegeCode) => {
  try {
    const data = await collegeAPI.delete(collegeCode);
    console.log('College deleted successfully');
  } catch (error) {
    console.error('Failed to delete college:', error.message);
  }
};

// ============================================
// CHATBOT EXAMPLES
// ============================================

// 1. Authenticate Chatbot (with external token)
const authenticateChatbotWithToken = async () => {
  try {
    const data = await chatbotAPI.authenticate('CLG12345', 'user-external-token-123');
    
    // Store chatbot token
    const chatbotToken = data.data.token;
    console.log('Chatbot authenticated');
    console.log('Student:', data.data.student);
    console.log('Is Guest:', data.data.isGuest); // false
    
  } catch (error) {
    console.error('Chatbot auth failed:', error.message);
  }
};

// 2. Authenticate Chatbot (guest mode - no external token)
const authenticateChatbotAsGuest = async () => {
  try {
    const data = await chatbotAPI.authenticate('CLG12345', null);
    
    // Store chatbot token
    const chatbotToken = data.data.token;
    console.log('Chatbot authenticated as guest');
    console.log('Guest user:', data.data.student);
    console.log('Is Guest:', data.data.isGuest); // true
    
  } catch (error) {
    console.error('Chatbot auth failed:', error.message);
  }
};

// 3. Send Message (requires chatbot token from authentication)
const sendChatbotMessage = async (chatbotToken) => {
  try {
    const data = await chatbotAPI.sendMessage('Hello, how can I apply for admission?', chatbotToken);
    console.log('Bot response:', data.data.response);
  } catch (error) {
    console.error('Failed to send message:', error.message);
  }
};

// ============================================
// COMPLETE WORKFLOW EXAMPLES
// ============================================

// Admin Registration → Get College Code → Share with Students
const adminWorkflow = async () => {
  try {
    // 1. Admin registers
    const registerData = await adminAPI.register('admin@college.com', 'pass123');
    const collegeCode = registerData.data.admin.collegeCode;
    
    console.log('Your College Code:', collegeCode);
    console.log('Share this code with students!');
    
    // 2. Admin can create additional college details
    await collegeAPI.create({
      name: 'My College',
      address: '123 Street'
    });
    
  } catch (error) {
    console.error('Workflow failed:', error.message);
  }
};

// Student Registration → Login → Access Chatbot
const studentWorkflow = async () => {
  try {
    // 1. Student registers with college code
    const registerData = await studentAPI.register(
      'Jane Doe',
      'jane@example.com',
      'pass123',
      'CLG12345'
    );
    
    const token = registerData.data.token;
    
    // 2. Later, student can login (no college code needed)
    const loginData = await studentAPI.login('jane@example.com', 'pass123');
    
    console.log('Student logged in:', loginData.data.student);
    
  } catch (error) {
    console.error('Workflow failed:', error.message);
  }
};

// External Website Chatbot Integration
const externalChatbotWorkflow = async (userToken) => {
  try {
    // 1. Authenticate chatbot with user's external token
    const authData = await chatbotAPI.authenticate('CLG12345', userToken);
    const chatbotToken = authData.data.token;
    
    // 2. Send messages
    const response1 = await chatbotAPI.sendMessage('What courses do you offer?', chatbotToken);
    console.log('Bot:', response1.data.response);
    
    const response2 = await chatbotAPI.sendMessage('What are the fees?', chatbotToken);
    console.log('Bot:', response2.data.response);
    
  } catch (error) {
    console.error('Chatbot workflow failed:', error.message);
  }
};

export {
  handleAdminRegister,
  handleAdminLogin,
  handleStudentRegister,
  handleStudentLogin,
  authenticateChatbotWithToken,
  sendChatbotMessage
};
