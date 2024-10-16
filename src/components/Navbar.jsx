import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import { HomeIcon, DevicePhoneMobileIcon, DocumentTextIcon, UsersIcon, ArchiveIcon, CogIcon } from '@heroicons/react/24/outline'; // Import the icons you want

export default function Navbar() {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const userToken = localStorage.getItem('appToken');
    if (userToken) {
      const decodedToken = jwtDecode(userToken);
      setUserRole(decodedToken.role);
    }
  }, []);

  const handleLogout = () => {
    if (window.confirm('Apakah Anda yakin ingin logout?')) {
      localStorage.removeItem('appToken');
      if (!localStorage.getItem('appToken')) {
        alert('Logout berhasil.');
        navigate('/login');
        window.location.reload();
      }
    }
  };

  return (
    <nav className="bg-gray-800">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile menu button */}
            <button
              type="button"
              className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              {/* Icon when menu is closed */}
              <svg
                className="block h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
              {/* Icon when menu is open */}
              <svg
                className="hidden h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="flex flex-1 items-center justify-between sm:items-stretch sm:justify-start">
            <div className="flex flex-shrink-0 items-center"></div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {/* Conditionally render links based on userRole */}
                {userRole === 'superAdmin' && (
                  <>
                    <a
                      href="/device"
                      className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      <DevicePhoneMobileIcon className="h-5 w-5 mr-1" />
                      Device
                    </a>
                    <a
                      href="/rules"
                      className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      <DocumentTextIcon className="h-5 w-5 mr-1" />
                      Rules
                    </a>
                    <a
                      href="/projects"
                      className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      <ArchiveIcon className="h-5 w-5 mr-1" />
                      Projects
                    </a>
                    <a
                      href="/devicetype"
                      className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      <CogIcon className="h-5 w-5 mr-1" />
                      Device Type
                    </a>
                    <a
                      href="/company"
                      className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      <UsersIcon className="h-5 w-5 mr-1" />
                      Company
                    </a>
                  </>
                )}
                {userRole === 'admin' && (
                  <>
                    <a
                      href="/deviceadmin"
                      className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      <DevicePhoneMobileIcon className="h-5 w-5 mr-1" />
                      Device
                    </a>
                    <a
                      href="/pengguna"
                      className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      <UsersIcon className="h-5 w-5 mr-1" />
                      Pengguna
                    </a>
                    <a
                      href="/laporanPetugas"
                      className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      <DocumentTextIcon className="h-5 w-5 mr-1" />
                      Laporan Petugas
                    </a>
                    <a
                      href="/manajemanKonflik"
                      className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      <DocumentTextIcon className="h-5 w-5 mr-1" />
                      Hasil Kamera
                    </a>
                  </>
                )}
                <div className="flex items-center">
                  <button
                    onClick={handleLogout}
                    className="ml-2 rounded-md px-3 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
