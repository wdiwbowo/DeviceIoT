import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

export default function App() {
  const [userRole, setUserRole] = useState('guest'); // Default ke guest
  const [error, setError] = useState(null); // Definisikan state error
  const navigate = useNavigate();

  useEffect(() => {
    const initializeUserRole = () => {
      try {
        const userToken = localStorage.getItem('userToken'); // Ambil userToken dari localStorage
        if (userToken) {
          const decodedToken = jwtDecode(userToken); // Dekode token
          const roleFromToken = decodedToken.role; // Ambil peran dari token
          setUserRole(roleFromToken); // Set peran pengguna
        } else {
          setUserRole('guest'); // Jika token tidak tersedia, default ke guest
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        setUserRole('guest'); // Set ke guest jika terjadi kesalahan
      }
    };

    initializeUserRole();
  }, []);

  const handleNavigation = () => {
    try {
      const userToken = localStorage.getItem('userToken'); // Ambil userToken dari localStorage
      if (userToken) {
        const decodedToken = jwtDecode(userToken); // Dekode token
        const roleFromToken = decodedToken.role; // Ambil peran dari token

        if (roleFromToken === 'superAdmin') {
          navigate('/device');
        } else if (roleFromToken === 'admin') {
          navigate('/deviceAdmin');
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
    <div className='bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center min-h-screen'>
      <div className="bg-gray-800 border-t-4 border-purple-600 shadow-lg rounded-lg max-w-lg w-full p-8">
        <h4 className='text-white text-3xl mb-4 font-semibold'>
          {`Selamat datang di aplikasi kami! ${userRole === 'superAdmin' ? 'Super Admin' : userRole === 'admin' ? 'Admin' : 'Guest'}`}
        </h4>
        <p className='text-lg text-gray-400 leading-relaxed mb-6'>
          Mari lanjutkan perjalanan Anda ke halaman berikutnya.
        </p>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          onClick={handleNavigation}
          className="inline-block border border-purple-600 text-purple-600 hover:text-white hover:bg-purple-600 py-3 px-6 rounded-lg transition duration-300 ease-in-out"
        >
          Lanjut ke halaman berikutnya
        </button>
      </div>
    </div>
  );
}
