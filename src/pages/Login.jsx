import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // Correct import for jwt-decode
import apiService from '../services/apiservice';
import { FaEye, FaEyeSlash, FaUser, FaLock } from 'react-icons/fa'; // Importing icons
import Swal from 'sweetalert2'; // Import SweetAlert

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
        const userRole = decodedToken.role; // Adjust according to the correct field

        // Redirect based on user role
        if (userRole === 'superAdmin') {
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
        <div className="flex justify-center mb-4">
          <FaUser className="text-blue-500 text-6xl hover:text-blue-600 transition duration-200" />
        </div>
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4 relative">
            <label htmlFor="username" className="block text-gray-700 mb-2">
              Username
            </label>
            <div className="flex items-center border border-gray-300 rounded">
              <span className="px-3 text-blue-500">
                <FaUser />
              </span>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 focus:outline-none"
                required
              />
            </div>
          </div>
          <div className="mb-6 relative">
            <label htmlFor="password" className="block text-gray-700 mb-2">
              Password
            </label>
            <div className="flex items-center border border-gray-300 rounded">
              <span className="px-3 text-blue-500">
                <FaLock />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 pr-10 focus:outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-2"
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <FaEyeSlash className="text-blue-500 hover:text-blue-600 transition duration-200" />
                ) : (
                  <FaEye className="text-blue-500 hover:text-blue-600 transition duration-200" />
                )}
              </button>
            </div>
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
