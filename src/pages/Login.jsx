import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode'; // Corrected import for jwt-decode
import apiService from '../services/apiservice';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Swal from 'sweetalert2';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await apiService.login(username, password);
      const userToken = localStorage.getItem('userToken');

      if (userToken) {
        const decodedToken = jwtDecode(userToken);
        const userRole = decodedToken.role;

        // Display success message for superAdmin
        if (userRole === 'superAdmin') {
          Swal.fire('Login Successful', 'You have logged in successfully!', 'success');
          navigate('device'); // Redirect to the Devices page for superadmins
        } else if (userRole === 'admin') {
          navigate('deviceadmin'); // Redirect to the Admin page for admins
        } else {
          Swal.fire('Error', 'Peran pengguna tidak dikenal.', 'error');
        }
      } else {
        Swal.fire('Error', 'Token pengguna tidak tersedia.', 'error');
      }
    } catch (error) {
      // Display SweetAlert for incorrect password
      Swal.fire('Error', 'Kata sandi salah.', 'error');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
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
          <div className="mb-6 relative">
            <label htmlFor="password" className="block text-gray-700 mb-2">
              Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-2"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <FaEyeSlash className="text-gray-600" /> : <FaEye className="text-gray-600" />}
            </button>
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
