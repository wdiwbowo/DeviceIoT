import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Corrected import statement
import apiService from '../services/apiservice';
import Swal from 'sweetalert2';

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

      // Ganti console.log dengan SweetAlert untuk menunjukkan token
      Swal.fire({
        icon: 'info',
        title: 'Retrieved Token',
        text: userToken ? userToken : 'Token pengguna tidak tersedia.',
        confirmButtonText: 'Ok'
      });

      if (userToken) {
        const decodedToken = jwtDecode(userToken);

        // Ganti console.log dengan SweetAlert untuk menunjukkan decoded token
        Swal.fire({
          icon: 'info',
          title: 'Decoded Token',
          text: JSON.stringify(decodedToken, null, 2),
          confirmButtonText: 'Ok'
        });

        const userRole = decodedToken.role; // Adjust according to the correct field

        // Ganti console.log dengan SweetAlert untuk menunjukkan role pengguna
        Swal.fire({
          icon: 'info',
          title: 'User Role',
          text: userRole ? userRole : 'Peran pengguna tidak tersedia.',
          confirmButtonText: 'Ok'
        });

        // Redirect based on user role
        if (userRole === 'superAdmin') {
          navigate('/Device'); // Redirect to the Devices page for superadmins
        } else if (userRole === 'admin') {
          navigate('/DeviceAdmin'); // Redirect to the Admin page for admins
        } else {
          setError('Peran pengguna tidak dikenal.');
        }
      } else {
        setError('Token pengguna tidak tersedia.');
      }
    } catch (error) {
      // Ganti dengan notifikasi SweetAlert
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error logging in: ' + error.message,
        confirmButtonText: 'Ok'
      });
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
