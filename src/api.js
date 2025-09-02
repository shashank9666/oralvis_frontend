import axios from "axios";

// Get the base URL from environment variables
const baseURL = import.meta.env.VITE_API_URL;

// Validate and format the base URL
const getFormattedBaseURL = () => {
  if (!baseURL) {
    console.error('VITE_API_URL is not defined in environment variables');
    return null;
  }

  // Add https:// if protocol is missing
  if (!baseURL.startsWith('http://') && !baseURL.startsWith('https://')) {
    return `https://${baseURL}`;
  }

  return baseURL;
};

// Create axios instance
const API = axios.create({
  baseURL: getFormattedBaseURL(),
  timeout: 30000, // 30 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token to requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request details in development
    if (import.meta.env.DEV) {
      console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, {
        baseURL: config.baseURL,
        headers: config.headers,
        data: config.data
      });
    }

    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle responses and errors globally
API.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (import.meta.env.DEV) {
      console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data
      });
    }

    return response;
  },
  (error) => {
    // Log errors in development
    if (import.meta.env.DEV) {
      console.error(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
    }

    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          console.warn('Unauthorized access - clearing token');
          localStorage.removeItem("token");
          window.location.href = '/login';
          break;
        case 403:
          console.warn('Forbidden access');
          break;
        case 404:
          console.warn('Resource not found');
          break;
        case 500:
          console.error('Server error');
          break;
        default:
          console.error(`HTTP Error ${status}`);
      }

      // Return a standardized error object
      return Promise.reject({
        status,
        message: data?.error || data?.message || `HTTP Error ${status}`,
        originalError: error
      });
    } else if (error.request) {
      // Network error or no response
      console.error('Network error - no response received:', error.request);
      return Promise.reject({
        status: 0,
        message: 'Network error. Please check your internet connection.',
        originalError: error
      });
    } else {
      // Request setup error
      console.error('Request setup error:', error.message);
      return Promise.reject({
        status: 0,
        message: 'Request failed to send.',
        originalError: error
      });
    }
  }
);

// Helper functions for common API operations
export const apiHelpers = {
  // Handle file uploads
  uploadFile: async (endpoint, formData, onUploadProgress) => {
    return API.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: onUploadProgress || undefined,
    });
  },

  // Handle logout
  logout: () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      // Basic token validation (you might want to decode and check expiry)
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  },

  // Get current user info from token
  getCurrentUser: () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload.id,
        role: payload.role,
        email: payload.email,
        exp: payload.exp
      };
    } catch {
      return null;
    }
  }
};

export default API;
