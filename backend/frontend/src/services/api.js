import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Mock data for development when backend is not available
const mockTeachers = [
  {
    id: 1,
    user_id: 1,
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@university.edu',
    university_name: 'Savitribai Phule Pune University',
    department: 'Computer Science',
    year_joined: 2020,
    gender: 'male'
  },
  {
    id: 2,
    user_id: 2,
    first_name: 'Jane',
    last_name: 'Smith',
    email: 'jane.smith@university.edu',
    university_name: 'Savitribai Phule Pune University',
    department: 'Mathematics',
    year_joined: 2019,
    gender: 'female'
  },
  {
    id: 3,
    user_id: 3,
    first_name: 'Aryan',
    last_name: 'Rathod',
    email: 'aryanrathod791@gmail.com',
    university_name: 'Savitribai Phule Pune University',
    department: 'Artificial Intelligence and Machine Learning',
    year_joined: 2021,
    gender: 'male'
  }
];

// Create axios instance but don't use it if backend is not available
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 2000, // Short timeout to quickly fall back to mock data
});

// Check if backend is available
let backendAvailable = false;

// Simple function to check backend health
const checkBackendHealth = async () => {
  try {
    await axios.get(`${API_BASE_URL}`, { timeout: 2000 });
    backendAvailable = true;
    console.log('Backend is available, using real API');
  } catch (error) {
    backendAvailable = false;
    console.log('Backend not available, using mock data');
  }
};

// Check backend health on startup
checkBackendHealth();

export const authAPI = {
  register: (userData) => {
    console.log('Registration data:', userData);
    // For development, simulate successful registration
    return Promise.resolve({
      data: {
        status: 201,
        message: 'User registered successfully',
        token: 'demo-token-123'
      }
    });
  },
  login: (credentials) => {
    console.log('Login credentials:', credentials);
    // For development, simulate successful login
    return Promise.resolve({
      data: {
        status: 200,
        message: 'Login successful',
        token: 'demo-token-123'
      }
    });
  },
};

export const teacherAPI = {
  getAll: async () => {
    // If backend is available, try to use real API
    if (backendAvailable) {
      try {
        const response = await api.get('/teachers');
        return response;
      } catch (error) {
        console.warn('Real API failed, falling back to mock data');
        backendAvailable = false;
      }
    }
    
    // Use mock data
    return Promise.resolve({
      data: {
        status: 200,
        data: mockTeachers
      }
    });
  },
  getById: async (id) => {
    // If backend is available, try to use real API
    if (backendAvailable) {
      try {
        const response = await api.get(`/teachers/${id}`);
        return response;
      } catch (error) {
        console.warn('Real API failed, falling back to mock data');
        backendAvailable = false;
      }
    }
    
    // Use mock data
    const teacher = mockTeachers.find(t => t.user_id === parseInt(id)) || mockTeachers[0];
    return Promise.resolve({
      data: {
        status: 200,
        data: teacher
      }
    });
  },
  create: (teacherData) => {
    // For real implementation, you would use:
    // return api.post('/teachers', teacherData);
    
    // For demo purposes, return mock response
    // Generate new ID based on existing mock teachers
    const newId = Math.max(...mockTeachers.map(t => t.id)) + 1;
    const newUserId = Math.max(...mockTeachers.map(t => t.user_id)) + 1;
    
    return Promise.resolve({
      data: {
        status: 201,
        message: 'Teacher created successfully',
        data: {
          id: newId,
          user_id: newUserId,
          ...teacherData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      }
    });
  }
};

export default api;