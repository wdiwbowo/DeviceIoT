import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// Base URLs for the API
const apiUrl = 'https://device-iot.pptik.id/api/v1';
const api = 'https://api-sso.lskk.co.id/v1';
const apiLocal = 'https://api-iot-log.lskk.co.id/v1';

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
const apiAdmin = axios.create({
  baseURL: apiLocal,
  headers: {
    'Content-Type': 'application/json',
  },
});
const apiAdminFile = axios.create({
  baseURL: apiLocal,
  headers: {
    // 'Content-Type': 'application/json',
    'Content-Type': 'multipart/form-data',

  },
});

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

// Add interceptor for requests to apiUser
apiUser.interceptors.request.use(
  (config) => {
    const userToken = localStorage.getItem('userToken');
    if (userToken) {
      config.headers.Authorization = `Bearer ${userToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiAdmin.interceptors.request.use(
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
  // Existing methods

  login: async (email, password) => {
    try {
      console.log('Login request data:', { email, password });
      const response = await apiUser.post('/users/login', {
        email,
        password,
        guidAplication: 'PROJECT-519391a1-bff6-4e8c-a854-bed3984cc0bb-2024',
      });
      console.log('Login response:', response.data);

      const token = response.data?.data; // Adjust based on actual API response
      if (token) {
        localStorage.setItem('appToken', token.appToken); // Ensure field names are correct
        localStorage.setItem('userToken', token.userToken); // Ensure field names are correct
      }
      return response.data;
    } catch (error) {
      console.error('Error logging in:', error.response?.data || error.message);
      throw error;
    }
  },

  getAllCompanies: async () => {
    try {
      const response = await apiUser.get('/companies');
      console.log('Get All Companies Response:', response.data); // Log the response data
      return response.data?.data || []; // Access and return the companies array, default to empty array
    } catch (error) {
      console.error('Error fetching companies:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch companies');
    }
  },

  //Super Admin
  getAllDevices: async () => {
    try {
      const response = await apiClient.get('/devices/admin/get');
      console.log('Get All Devices Response:', response.data);
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
      console.log('Add Device Response:', response.data);
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

  updateDevice: async (guid, deviceData) => {
    if (!guid) {
      console.error('GUID is required for updating device.');
      throw new Error('GUID is required.');
    }

    try {
      const response = await apiClient.put(`/devices/update/${guid}`, deviceData);
      console.log('Update Device Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating device:', error);
      if (error.response?.status === 401) {
        console.error('Unauthorized access. Please log in again.');
        throw new Error('Unauthorized access. Please log in again.');
      }
      throw new Error(error.response?.data?.message || 'Failed to update device');
    }
  },

  deleteDevice: async (guid) => {
    if (!guid) {
      console.error('GUID is required for deleting device.');
      throw new Error('GUID is required.');
    }

    try {
      const response = await apiClient.delete(`/devices/delete/${guid}`);
      console.log('Delete Device Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error deleting device:', error);
      if (error.response?.status === 401) {
        console.error('Unauthorized access. Please log in again.');
        throw new Error('Unauthorized access. Please log in again.');
      }
      throw new Error(error.response?.data?.message || 'Failed to delete device');
    }
  },

  getAllRules: async () => {
    try {
      const response = await apiClient.get('/rules/all');
      console.log('Get All Rules Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching rules:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch rules');
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
      console.log('Add Rule Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error adding rule:', error);
      throw new Error(error.response?.data?.message || 'Failed to add rule');
    }
  },

  updateRule: async (guid, newGuidInput, newValueInput, newGuidOutput, newValueOutput) => {
    try {
      const requestData = {
        guidInput: newGuidInput,
        valueInput: newValueInput,
        guidOutput: newGuidOutput,
        valueOutput: newValueOutput,
      };

      console.log('Request Data:', requestData);

      const response = await apiClient.put(`/rules/update/${guid}`, requestData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Update Rule Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating rule:', error);
      if (error.response?.status === 401) {
        console.error('Unauthorized access. Please log in again.');
        throw new Error('Unauthorized access. Please log in again.');
      }
      throw new Error(error.response?.data?.message || 'Failed to update rule');
    }
  },

  deleteRule: async (guid) => {
    if (!guid) {
      console.error('GUID is required for deleting rule.');
      throw new Error('GUID is required.');
    }

    try {
      const response = await apiClient.delete(`/rules/delete/${guid}`);
      console.log('Delete Rule Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error deleting rule:', error);
      if (error.response?.status === 401) {
        console.error('Unauthorized access. Please log in again.');
        throw new Error('Unauthorized access. Please log in again.');
      }
      throw new Error(error.response?.data?.message || 'Failed to delete rule');
    }
  },

  getAllProjects: async () => {
    try {
      const response = await apiClient.get('/projects/get');
      console.log('Get All Projects Response:', response.data);
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
      console.log('Add Project Response:', response.data);
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

  updateProject: async (guid, projectData) => {
    if (!guid) {
      console.error('GUID is required for updating project.');
      throw new Error('GUID is required.');
    }

    try {
      const response = await apiClient.put(`/projects/update/${guid}`, projectData);
      console.log('Update Project Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating project:', error);
      if (error.response?.status === 401) {
        console.error('Unauthorized access. Please log in again.');
        throw new Error('Unauthorized access. Please log in again.');
      }
      throw new Error(error.response?.data?.message || 'Failed to update project');
    }
  },

  deleteProject: async (guid) => {
    if (!guid) {
      console.error('GUID is required for deleting project.');
      throw new Error('GUID is required.');
    }

    try {
      const response = await apiClient.delete(`/projects/delete/${guid}`);
      console.log('Delete Project Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error deleting project:', error);
      if (error.response?.status === 401) {
        console.error('Unauthorized access. Please log in again.');
        throw new Error('Unauthorized access. Please log in again.');
      }
      throw new Error(error.response?.data?.message || 'Failed to delete project');
    }
  },

  getDeviceTypes: async () => {
    try {
      const response = await apiClient.get('/device-types/get');
      console.log('Get Device Types Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching device types:', error);
      throw error;
    }
  },

  addDeviceType: async (deviceTypeData) => {
    try {
      const response = await apiClient.post('/device-types/add', deviceTypeData);
      console.log('Add Device Type Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error adding device type:', error);
      throw new Error(error.response?.data?.message || 'Failed to add device type');
    }
  },

  updateDeviceType: async (guid, deviceTypeData) => {
    if (!guid) {
      console.error('GUID is required for updating device type.');
      throw new Error('GUID is required.');
    }

    try {
      const response = await apiClient.put(`/device-types/update/${guid}`, deviceTypeData);
      console.log('Update Device Type Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating device type:', error);
      if (error.response?.status === 401) {
        console.error('Unauthorized access. Please log in again.');
        throw new Error('Unauthorized access. Please log in again.');
      }
      throw new Error(error.response?.data?.message || 'Failed to update device type');
    }
  },

  deleteDeviceType: async (guid) => {
    if (!guid) {
      console.error('GUID is required for deleting device type.');
      throw new Error('GUID is required.');
    }

    try {
      const response = await apiClient.delete(`/device-types/delete/${guid}`);
      console.log('Delete Device Type Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error deleting device type:', error);
      if (error.response?.status === 401) {
        console.error('Unauthorized access. Please log in again.');
        throw new Error('Unauthorized access. Please log in again.');
      }
      throw new Error(error.response?.data?.message || 'Failed to delete device type');
    }
  },

  //Admin
  getAllDevicesCompany: async () => {
    try {
      const response = await apiClient.get('/devices/company/get');
      console.log('Get All Devices Response:', response.data);
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
      const response = await apiClient.post('/devices/add', deviceData);
      console.log('Add Device Response:', response.data);
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

  updateDeviceCompany: async (guid, deviceData) => {
    if (!guid) {
      console.error('GUID is required for updating device.');
      throw new Error('GUID is required.');
    }

    try {
      const response = await apiClient.put(`/devices/update/${guid}`, deviceData);
      console.log('Update Device Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating device:', error);
      if (error.response?.status === 401) {
        console.error('Unauthorized access. Please log in again.');
        throw new Error('Unauthorized access. Please log in again.');
      }
      throw new Error(error.response?.data?.message || 'Failed to update device');
    }
  },

  deleteDeviceCompany: async (guid) => {
    if (!guid) {
      console.error('GUID is required for deleting device.');
      throw new Error('GUID is required.');
    }

    try {
      const response = await apiClient.delete(`/devices/delete/${guid}`);
      console.log('Delete Device Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error deleting device:', error);
      if (error.response?.status === 401) {
        console.error('Unauthorized access. Please log in again.');
        throw new Error('Unauthorized access. Please log in again.');
      }
      throw new Error(error.response?.data?.message || 'Failed to delete device');
    }
  },

  getAllUser: async () => {
    try {
      const response = await apiUser.get('/users/by-module');
      console.log('Get All Users Response:', response.data);
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        console.error('Unauthorized access. Please log in again.');
        throw new Error('Unauthorized access. Please log in again.');
      } else {
        console.error('Error fetching users:', error);
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch users');
    }
  },

  addUser: async (userData) => {
    try {
      const response = await apiUser.post('/users/adduser', userData); // kirim userData tanpa config tambahan
      return response.data; // pastikan untuk mengembalikan response data
    } catch (error) {
      console.error('Error adding user:', error);
      throw error; // pastikan untuk melempar error agar bisa ditangani di luar
    }
  },

  getAllReportsByCompany: async (queryParams) => {
    try {
      const response = await apiAdmin.get('/reports/company', { 
        params: {
          companyGuid: queryParams.companyGuid, // GUID perusahaan
          type: queryParams.type,               // Tipe report
        }
      });
      console.log('Get All Reports by Company Response:', response.data);
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        console.error('Unauthorized access. Please log in again.');
      } else {
        console.error('Error fetching reports:', error);
      }
      throw error;
    }
  },

  addReport: async (formData, token) => {
    try {
        const response = await apiAdminFile.post('/reports/create', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to add report");
    }
},
  
  decodeTokenUser: async () => {
    const userToken = localStorage.getItem('userToken');
    const decodedToken = jwtDecode(userToken);
    return decodedToken;
  },

  decodeTokenApp: async () => {
    const appToken = localStorage.getItem('appToken');
    const decodedToken = jwtDecode(appToken);
    return decodedToken;
  },
};

export default apiService; 
