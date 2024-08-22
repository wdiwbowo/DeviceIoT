import axios from 'axios';

// Base URL for the API
const apiUrl = 'https://device-iot.pptik.id/api/v1/';

// Define the token
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJndWlkIjoiVVNFUi04YjI1NmM2MC0zYTVhLTQ2ZTMtOTMyOC0wMTIzZjcwMDY1YWYtMjAyNCIsIm5hbWUiOiJUTldLIiwiZ3VpZEFwbGljYXRpb24iOiJQUk9KRUNULTUxOTM5MWExLWJmZjYtNGU4Yy1hODU0LWJlZDM5ODRjYzBiYi0yMDI0Iiwicm9sZSI6ImFkbWluIiwiY29tcGFueUd1aWQiOiJDT01QQU5ZLTNlZjk3OGIyLWM4MGMtNDNkYS05MGMzLWRmNDIzNjM1ZjQzNi0yMDI0IiwiaWF0IjoxNzI0MDM2MzI2LCJleHAiOjE3MjQ2NDExMjZ9.IqAVlfoaHtQHirjyCuzS-wAojwDV3ABmd-Unv3giCjE';

// Create an Axios instance
const apiClient = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`, // Set the token in the default headers
  },
});

// Define API service methods
const apiService = {
  addRule: async (guidInput, valueInput, guidOutput, valueOutput) => {
    try {
      const response = await apiClient.post('/rules/add', {
        guidInput,
        valueInput,
        guidOutput,
        valueOutput
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to add rule');
    }
  },

  getAllRules: async () => {
    try {
      const response = await apiClient.get('/rules/all');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch rules');
    }
  },

  getAllDevices: async () => {
    try {
      const response = await apiClient.get('/devices/admin/get');
      return response.data; // Adjust according to the actual API response structure
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch devices');
    }
  },

  addDevice: async (deviceData) => {
    try {
      const response = await apiClient.post('/devices/admin/add', deviceData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to add device');
    }
  },
};

export default apiService;
