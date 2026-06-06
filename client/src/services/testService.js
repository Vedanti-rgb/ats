import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Setup axios instance with auth header
const testApi = axios.create({
  baseURL: `${API_URL}/api/tests`,
});

// Interceptor to attach token
testApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Generate a new AI test based on a specific resume
 */
export const generateTest = async (resumeId) => {
  const response = await testApi.post(`/generate/${resumeId}`);
  return response.data;
};

/**
 * Submit test answers for evaluation
 */
export const submitTest = async (testId, answers) => {
  const response = await testApi.post(`/submit/${testId}`, { answers });
  return response.data;
};

/**
 * Get test history for a specific resume
 */
export const getTestHistory = async (resumeId) => {
  const response = await testApi.get(`/history/${resumeId}`);
  return response.data;
};

const testService = {
  generateTest,
  submitTest,
  getTestHistory,
};

export default testService;
