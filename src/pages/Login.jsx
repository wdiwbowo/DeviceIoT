import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // Corrected import statement
import apiService from '../services/apiservice';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setError(null);
  
    try {
      const response = await apiService.login(username, password);
      const userToken = localStorage.getItem('userToken');
      console.log('Retrieved userToken:', userToken);
  
      if (userToken) {
        const decodedToken = jwtDecode(userToken);
        console.log('Decoded Token:', decodedToken);
  
        const userRole = decodedToken.role; // Adjust according to the correct field
        console.log('User Role:', userRole);
  
        // Redirect based on user role
        if (userRole === 'superAdmin') {
          navigate('/'); // Redirect to the Devices page for superadmins
        } else if (userRole === 'admin') {
          navigate('/'); // Redirect to the Admin page for admins
         } else {
          setError('Peran pengguna tidak dikenal.');
        }
      } else {
        setError('Token pengguna tidak tersedia.');
      }
    } catch (error) {
      setError('Error logging in: ' + error.message);
    }
  };  

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
