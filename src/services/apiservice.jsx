Fimport axios from 'axios';
import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode';

// Base URLs for the API
const apiUrl = 'https://api-iot-device.lskk.co.id/v1';
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
      const response = await apiUser.post('/users/login', {
        email,
        password,
        guidAplication: 'PROJECT-519391a1-bff6-4e8c-a854-bed3984cc0bb-2024',
      });

      const token = response.data?.data; // Adjust based on actual API response
      if (token) {
        localStorage.setItem('appToken', token.appToken); 
        localStorage.setItem('userToken', token.userToken); 
      }

      Swal.fire('Login Successful', 'You have logged in successfully!', 'success');
      return response.data;
    } catch (error) {
      Swal.fire('Error', error.response?.data || 'Error logging in', 'error');
      throw error;
    }
  },

  getAllCompanies: async () => {
    try {
      const response = await apiUser.get('/companies');
      return response.data?.data || [];
    } catch (error) {
      Swal.fire('Error', error.response?.data?.message || 'Failed to fetch companies', 'error');
      throw new Error(error.response?.data?.message || 'Failed to fetch companies');
    }
  },

  // Super Admin
  getAllDevices: async () => {
    try {
      const response = await apiClient.get('/devices/admin/get');
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        Swal.fire('Unauthorized', 'Please log in again.', 'error');
      } else {
        Swal.fire('Error', 'Failed to fetch devices', 'error');
      }
      throw error;
    }
  },

  addDevice: async (deviceData) => {
    try {
      const response = await apiClient.post('/devices/admin/add', deviceData);
      Swal.fire('Success', 'Device added successfully!', 'success');
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        Swal.fire('Unauthorized', 'Please log in again.', 'error');
        throw new Error('Unauthorized access. Please log in again.');
      }
      Swal.fire('Error', error.response?.data?.message || 'Failed to add device', 'error');
      throw new Error(error.response?.data?.message || 'Failed to add device');
    }
  },

  updateDevice: async (guid, deviceData) => {
    if (!guid) {
      Swal.fire('Error', 'GUID is required for updating device.', 'error');
      throw new Error('GUID is required.');
    }

    try {
      const response = await apiClient.put(`/devices/update/${guid}`, deviceData);
      Swal.fire('Success', 'Device updated successfully!', 'success');
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        Swal.fire('Unauthorized', 'Please log in again.', 'error');
        throw new Error('Unauthorized access. Please log in again.');
      }
      Swal.fire('Error', error.response?.data?.message || 'Failed to update device', 'error');
      throw new Error(error.response?.data?.message || 'Failed to update device');
    }
  },

  deleteDevice: async (guid) => {
    if (!guid) {
      Swal.fire('Error', 'GUID is required for deleting device.', 'error');
      throw new Error('GUID is required.');
    }

    try {
      const response = await apiClient.delete(`/devices/delete/${guid}`);
      Swal.fire('Success', 'Device deleted successfully!', 'success');
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        Swal.fire('Unauthorized', 'Please log in again.', 'error');
        throw new Error('Unauthorized access. Please log in again.');
      }
      Swal.fire('Error', error.response?.data?.message || 'Failed to delete device', 'error');
      throw new Error(error.response?.data?.message || 'Failed to delete device');
    }
  },

  getAllRules: async () => {
    try {
      const response = await apiClient.get('/rules/all');
      return response.data;
    } catch (error) {
      Swal.fire('Error', error.response?.data?.message || 'Failed to fetch rules', 'error');
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
      Swal.fire('Success', 'Rule added successfully!', 'success');
      return response.data;
    } catch (error) {
      Swal.fire('Error', error.response?.data?.message || 'Failed to add rule', 'error');
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
  
      const response = await apiClient.put(`/rules/update/${guid}`, requestData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      Swal.fire('Success', 'Rule updated successfully!', 'success');
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        Swal.fire('Error', 'Unauthorized access. Please log in again.', 'error');
      } else {
        Swal.fire('Error', error.response?.data?.message || 'Failed to update rule', 'error');
      }
      throw new Error(error.response?.data?.message || 'Failed to update rule');
    }
  },
  
  deleteRule: async (guid) => {
  if (!guid) {
    Swal.fire('Error', 'GUID is required.', 'error');
    console.error('Error: GUID is required.');
    throw new Error('GUID is required.');
  }

  try {
    console.log(`Attempting to delete rule with GUID: ${guid}`);
    const response = await apiClient.delete(`/rules/delete/${guid}`);
    console.log('Delete Rule Response:', response.data);
    Swal.fire('Success', 'Rule deleted successfully!', 'success');
    return response.data;
  } catch (error) {
    console.error('Error deleting rule:', error);

    if (error.response?.status === 401) {
      Swal.fire('Error', 'Unauthorized access. Please log in again.', 'error');
      console.error('Unauthorized access. Redirecting to login.');
      throw new Error('Unauthorized access. Please log in again.');
    } else {
      const errorMessage = error.response?.data?.message || 'Failed to delete rule';
      Swal.fire('Error', errorMessage, 'error');
      console.error('Failed to delete rule:', errorMessage);
      throw new Error(errorMessage);
    }
  }
},
  
  getAllProjects: async () => {
    try {
      const response = await apiClient.get('/projects/get');
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        Swal.fire('Error', 'Unauthorized access. Please log in again.', 'error');
      } else {
        Swal.fire('Error', 'Error fetching projects', 'error');
      }
      throw error;
    }
  },
  
  addProject: async (projectData) => {
    try {
      const response = await apiClient.post('/projects/add', projectData);
      Swal.fire('Success', 'Project added successfully!', 'success');
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        Swal.fire('Error', 'Unauthorized access. Please log in again.', 'error');
      } else {
        Swal.fire('Error', error.response?.data?.message || 'Failed to add project', 'error');
      }
      throw new Error(error.response?.data?.message || 'Failed to add project');
    }
  },
  
updateProject: async (guid, projectData) => {
    try {
        const response = await apiClient.put(`/projects/update/${guid}`, projectData);
        console.log('Update Project Response:', response.data);
        return response.data;
    } catch (error) {
        if (error.response) {
            // Log more details from the error response
            console.error('Server responded with status:', error.response.status);
            console.error('Response data:', error.response.data);
        } else {
            console.error('Error message:', error.message);
        }
        throw new Error(error.response?.data?.message || 'Failed to update project');
    }
},
  
  deleteProject: async (guid) => {
    if (!guid) {
      Swal.fire('Error', 'GUID is required.', 'error');
      throw new Error('GUID is required.');
    }
  
    try {
      const response = await apiClient.delete(`/projects/delete/${guid}`);
      Swal.fire('Success', 'Project deleted successfully!', 'success');
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        Swal.fire('Error', 'Unauthorized access. Please log in again.', 'error');
      } else {
        Swal.fire('Error', error.response?.data?.message || 'Failed to delete project', 'error');
      }
      throw new Error(error.response?.data?.message || 'Failed to delete project');
    }
  },
  
  getDeviceTypes: async () => {
    try {
      const response = await apiClient.get('/device-types/get');
      return response.data;
    } catch (error) {
      Swal.fire('Error', 'Error fetching device types', 'error');
      throw error;
    }
  },
  
  addDeviceType: async (deviceTypeData) => {
    try {
      const response = await apiClient.post('/device-types/add', deviceTypeData);
      Swal.fire('Success', 'Device type added successfully!', 'success');
      return response.data;
    } catch (error) {
      Swal.fire('Error', error.response?.data?.message || 'Failed to add device type', 'error');
      throw new Error(error.response?.data?.message || 'Failed to add device type');
    }
  },
  
  updateDeviceType: async (guid, deviceTypeData) => {
    if (!guid) {
      Swal.fire('Error', 'GUID is required.', 'error');
      throw new Error('GUID is required.');
    }
  
    try {
      const response = await apiClient.put(`/device-types/update/${guid}`, deviceTypeData);
      Swal.fire('Success', 'Device type updated successfully!', 'success');
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        Swal.fire('Error', 'Unauthorized access. Please log in again.', 'error');
      } else {
        Swal.fire('Error', error.response?.data?.message || 'Failed to update device type', 'error');
      }
      throw new Error(error.response?.data?.message || 'Failed to update device type');
    }
  },
  
  deleteDeviceType: async (guid) => {
    if (!guid) {
      Swal.fire('Error', 'GUID is required.', 'error');
      throw new Error('GUID is required.');
    }
  
    try {
      const response = await apiClient.delete(`/device-types/delete/${guid}`);
      Swal.fire('Success', 'Device type deleted successfully!', 'success');
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        Swal.fire('Error', 'Unauthorized access. Please log in again.', 'error');
      } else {
        Swal.fire('Error', error.response?.data?.message || 'Failed to delete device type', 'error');
      }
      throw new Error(error.response?.data?.message || 'Failed to delete device type');
    }
  },
  
  getAllDevicesCompany: async () => {
    try {
      const response = await apiClient.get('/devices/company/get');
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        Swal.fire('Error', 'Unauthorized access. Please log in again.', 'error');
      } else {
        Swal.fire('Error', 'Error fetching devices', 'error');
      }
      throw error;
    }
  },
  
  addDevices: async (deviceData) => {
    try {
      const response = await apiClient.post('/devices/add', deviceData);
      Swal.fire('Success', 'Device added successfully!', 'success');
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        Swal.fire('Error', 'Unauthorized access. Please log in again.', 'error');
      } else {
        Swal.fire('Error', error.response?.data?.message || 'Failed to add device', 'error');
      }
      throw new Error(error.response?.data?.message || 'Failed to add device');
    }
  },

  updateDeviceCompany: async (guid, deviceData) => {
      if (!guid) {
          Swal.fire('Error', 'GUID is required for updating device.', 'error');
          throw new Error('GUID is required.');
      }
  
      try {
          const response = await apiClient.put(`/devices/update/${guid}`, deviceData);
          Swal.fire('Success', 'Device updated successfully.', 'success');
          return response.data;
      } catch (error) {
          if (error.response?.status === 401) {
              Swal.fire('Error', 'Unauthorized access. Please log in again.', 'error');
              throw new Error('Unauthorized access. Please log in again.');
          }
          Swal.fire('Error', error.response?.data?.message || 'Failed to update device', 'error');
          throw new Error(error.response?.data?.message || 'Failed to update device');
      }
  },
  
  deleteDeviceCompany: async (guid) => {
      if (!guid) {
          Swal.fire('Error', 'GUID is required for deleting device.', 'error');
          throw new Error('GUID is required.');
      }
  
      try {
          const response = await apiClient.delete(`/devices/delete/${guid}`);
          Swal.fire('Success', 'Device deleted successfully.', 'success');
          return response.data;
      } catch (error) {
          if (error.response?.status === 401) {
              Swal.fire('Error', 'Unauthorized access. Please log in again.', 'error');
              throw new Error('Unauthorized access. Please log in again.');
          }
          Swal.fire('Error', error.response?.data?.message || 'Failed to delete device', 'error');
          throw new Error(error.response?.data?.message || 'Failed to delete device');
      }
  },
  
  getAllUser: async () => {
      try {
          const response = await apiUser.get('/users/by-module');
          Swal.fire('Success', 'Users fetched successfully.', 'success');
          return response.data;
      } catch (error) {
          if (error.response?.status === 401) {
              Swal.fire('Error', 'Unauthorized access. Please log in again.', 'error');
              throw new Error('Unauthorized access. Please log in again.');
          }
          Swal.fire('Error', error.response?.data?.message || 'Failed to fetch users', 'error');
          throw new Error(error.response?.data?.message || 'Failed to fetch users');
      }
  },
  
  addUser: async (userData) => {
      try {
          const response = await apiUser.post('/users/adduser', userData);
          Swal.fire('Success', 'User added successfully.', 'success');
          return response.data;
      } catch (error) {
          Swal.fire('Error', error.response?.data?.message || 'Failed to add user', 'error');
          throw new Error(error.response?.data?.message || 'Failed to add user');
      }
  },
  
  getAllReportsByCompany: async (queryParams) => {
      try {
          const response = await apiAdmin.get('/reports/company', {
              params: {
                  companyGuid: queryParams.companyGuid,
                  type: queryParams.type,
              }
          });
          Swal.fire('Success', 'Reports fetched successfully.', 'success');
          return response.data;
      } catch (error) {
          if (error.response?.status === 401) {
              Swal.fire('Error', 'Unauthorized access. Please log in again.', 'error');
              throw new Error('Unauthorized access. Please log in again.');
          }
          Swal.fire('Error', error.response?.data?.message || 'Failed to fetch reports', 'error');
          throw new Error(error.response?.data?.message || 'Failed to fetch reports');
      }
  },
  
  addReport: async (formData, token) => {
      try {
          const response = await apiAdminFile.post('/reports/create', formData, {
              headers: {
                  'Content-Type': 'multipart/form-data',
                  'Authorization': `Bearer ${token}`,
              }
          });
          Swal.fire('Success', 'Report added successfully.', 'success');
          return response.data;
      } catch (error) {
          Swal.fire('Error', error.response?.data?.message || 'Failed to add report', 'error');
          throw new Error(error.response?.data?.message || 'Failed to add report');
      }
  },  

  getUserProfile: async () => {
    try {
      const response = await apiUser.get('/users/profile');
      return response.data;
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          throw new Error('Unauthorized access. Please log in again.');
        }
        throw new Error(`Error ${error.response.status}: ${error.response.statusText}`);
      } else {
        throw new Error('Failed to fetch profile. Please try again.');
      }
    }
  },

  updatePassword: async (email, currentPassword, newPassword) => {
  try {
    const response = await apiUser.post('/users/edit-password', {
      email,
      currentPassword,
      newPassword
    });

    if (response.data && response.data.success) {
      return {
        success: true,
        message: 'Password updated successfully.',
        data: response.data
      };
    } else {
      return {
        success: false,
        message: response.data.message || 'Failed to update password.'
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'An error occurred while updating the password.'
    };
  }
},

  updateUserProfile: async (profileData) => {
  try {
    const response = await apiUser.post(
      '/users/edit-profile',
      {
        newName: profileData.name,
        newPhoneNumber: profileData.phoneNumber,
        newAddress: profileData.address || '' // Kirimkan alamat kosong jika tidak ada
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
},

  uploadProfileImage: async (formData) => {
  const token = localStorage.getItem('appToken');
  const response = await apiUser.post('/images/profile', formData, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  return response;
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
