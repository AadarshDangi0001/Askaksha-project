const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050/api';

const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  
  return data;
};

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'x-auth-token': token })
  };
};

const getStudentAuthHeaders = () => {
  const token = localStorage.getItem('studentToken') || localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'x-auth-token': token })
  };
};

export const adminAPI = {
  register: async (name, email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    return handleResponse(response);
  },

  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return handleResponse(response);
  },

  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  getDashboard: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/dashboard`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

export const collegeAPI = {
  create: async (collegeData) => {
    const response = await fetch(`${API_BASE_URL}/college/save`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(collegeData)
    });
    return handleResponse(response);
  },

  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/college/my`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  getMy: async () => {
    const response = await fetch(`${API_BASE_URL}/college/my`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  update: async (collegeData) => {
    const response = await fetch(`${API_BASE_URL}/college/save`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(collegeData)
    });
    return handleResponse(response);
  }
};

export const studentAPI = {
  register: async (name, email, password, collegeCode) => {
    const response = await fetch(`${API_BASE_URL}/student/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, collegeCode })
    });
    return handleResponse(response);
  },

  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/student/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return handleResponse(response);
  },

  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/student/dashboard`, {
      method: 'GET',
      headers: getStudentAuthHeaders()
    });
    return handleResponse(response);
  },

  getDashboard: async () => {
    const response = await fetch(`${API_BASE_URL}/student/dashboard`, {
      method: 'GET',
      headers: getStudentAuthHeaders()
    });
    return handleResponse(response);
  }
};

export const chatAPI = {
  getHistory: async () => {
    const response = await fetch(`${API_BASE_URL}/chat/history`, {
      method: 'GET',
      headers: getStudentAuthHeaders()
    });
    return handleResponse(response);
  }
};

export const chatbotAPI = {
  authenticate: async (collegeCode, externalToken = null) => {
    const response = await fetch(`${API_BASE_URL}/chatbot/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ collegeCode, externalToken })
    });
    return handleResponse(response);
  },

  sendMessage: async (message, chatbotToken) => {
    const response = await fetch(`${API_BASE_URL}/chatbot/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${chatbotToken}`
      },
      body: JSON.stringify({ message })
    });
    return handleResponse(response);
  }
};

export default {
  admin: adminAPI,
  college: collegeAPI,
  student: studentAPI,
  chat: chatAPI,
  chatbot: chatbotAPI
};
