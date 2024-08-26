import axios from 'axios';

// Base URLs for the API
const apiUrl = 'https://device-iot.pptik.id/api/v1';
const api = 'https://api-sso.lskk.co.id/v1/';

// Create Axios instances
const apiClient = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});
const apiUser = axios.create({
  baseURL: api,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Set the appToken directly to localStorage
// localStorage.setItem('appToken', 'your-app-token-here');

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
  login: async (email, password) => {
    try {
      console.log('Login request data:', { email, password, guidAplication: 'PROJECT-519391a1-bff6-4e8c-a854-bed3984cc0bb-2024' });
      const response = await apiUser.post('/users/login', {
        email,
        password,
        guidAplication: 'PROJECT-519391a1-bff6-4e8c-a854-bed3984cc0bb-2024',
      });
      console.log('Login response:', response.data);
      const token = response.data?.data;
      if (token) {
        localStorage.setItem('userToken', token.userToken);
        localStorage.setItem('appToken', token.appToken);
      }
      return response.data;
    } catch (error) {
      console.error('Error logging in:', error.response?.data || error.message);
      throw error;
    }
  },

  getAllDevices: async () => {
    try {
      const response = await apiClient.get('/devices/admin/get');
      console.log('Get All Devices Response:', response.data); // Log the response data
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
      console.log('Add Device Response:', response.data); // Log the response data
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
      console.log('Add Rule Response:', response.data); // Log the response data
      return response.data;
    } catch (error) {
      console.error('Error adding rule:', error);
      throw new Error(error.response?.data?.message || 'Failed to add rule');
    }
  },

  getAllRules: async () => {
    try {
      const response = await apiClient.get('/rules/all');
      console.log('Get All Rules Response:', response.data); // Log the response data
      return response.data;
    } catch (error) {
      console.error('Error fetching rules:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch rules');
    }
  },

  getAllProjects: async () => {
    try {
      const response = await apiClient.get('/projects/get');
      console.log('Get All Projects Response:', response.data); // Log the response data
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

  addProject: async (projectData) => {
    try {
      const response = await apiClient.post('/projects/add', projectData);
      console.log('Add Project Response:', response.data); // Log the response data
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

  getDeviceTypes: async () => {
    try {
      const response = await apiClient.get('/device-types/get');
      console.log('Get Device Types Response:', response.data); // Log the response data
      return response.data;
    } catch (error) {
      console.error('Error fetching device types:', error);
      throw error;
    }
  },

  addDeviceType: async (deviceTypeData) => {
    try {
      const response = await apiClient.post('/device-types/add', deviceTypeData);
      console.log('Add Device Type Response:', response.data); // Log the response data
      return response.data;
    } catch (error) {
      console.error('Error adding device type:', error);
      throw new Error(error.response?.data?.message || 'Failed to add device type');
    }
  },
};

export default apiService;
