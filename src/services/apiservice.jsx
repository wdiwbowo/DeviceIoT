import axios from 'axios';

// Base URL for the API
const apiUrl = 'https://device-iot.pptik.id/api/v1';

// Create Axios instance
const apiClient = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Set the appToken directly to localStorage (can be placed in componentDidMount or useEffect)
localStorage.setItem('appToken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJndWlkIjoiVVNFUi04YjI1NmM2MC0zYTVhLTQ2ZTMtOTMyOC0wMTIzZjcwMDY1YWYtMjAyNCIsIm5hbWUiOiJUTldLIiwiZ3VpZEFwbGljYXRpb24iOiJQUk9KRUNULTUxOTM5MWExLWJmZjYtNGU4Yy1hODU0LWJlZDM5ODRjYzBiYi0yMDI0Iiwicm9sZSI6ImFkbWluIiwiY29tcGFueUd1aWQiOiJDT01QQU5ZLTNlZjk3OGIyLWM4MGMtNDNkYS05MGMzLWRmNDIzNjM1ZjQzNi0yMDI0IiwiaWF0IjoxNzI0MDM2MzI2LCJleHAiOjE3MjQ2NDExMjZ9.IqAVlfoaHtQHirjyCuzS-wAojwDV3ABmd-Unv3giCjE');

// Add interceptor for requests to apiClient
apiClient.interceptors.request.use(
  (config) => {
    const appToken = localStorage.getItem('appToken');
    if (appToken) {
      config.headers.Authorization = `Bearer ${appToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const apiService = {
  getAllDevices: async () => {
    try {
      const response = await apiClient.get('/devices/admin/get');
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        console.error('Unauthorized access. Please log in again.');
      } else {
        console.error('Error fetching devices:', error);
      }
      throw error;
    }
  },
  
  addDevice: async (deviceData) => {
    try {
      const response = await apiClient.post('/devices/admin/add', deviceData);
      return response.data;
    } catch (error) {
      console.error('Error adding device:', error);
      if (error.response?.status === 401) {
        console.error('Unauthorized access. Please log in again.');
        throw new Error('Unauthorized access. Please log in again.');
      }
      throw new Error(error.response?.data?.message || 'Failed to add device');
    }
  },

  addRule: async (guidInput, valueInput, guidOutput, valueOutput) => {
    try {
      const response = await apiClient.post('/rules/add', {
        guidInput,
        valueInput,
        guidOutput,
        valueOutput,
      });
      return response.data;
    } catch (error) {
      console.error('Error adding rule:', error);
      throw new Error(error.response?.data?.message || 'Failed to add rule');
    }
  },

  getAllRules: async () => {
    try {
      const response = await apiClient.get('/rules/all');
      return response.data;
    } catch (error) {
      console.error('Error fetching rules:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch rules');
    }
  },
  getAllProjects: async () => {
    try {
      const response = await apiClient.get('/projects/get');
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        console.error('Unauthorized access. Please log in again.');
      } else {
        console.error('Error fetching projects:', error);
      }
      throw error;
    }
  },
  
  // Add a new project
  addProject: async (projectData) => {
    try {
      const response = await apiClient.post('/projects/add', projectData);
      return response.data;
    } catch (error) {
      console.error('Error adding project:', error);
      if (error.response?.status === 401) {
        console.error('Unauthorized access. Please log in again.');
        throw new Error('Unauthorized access. Please log in again.');
      }
      throw new Error(error.response?.data?.message || 'Failed to add project');
    }
  },  
};

export default apiService;
