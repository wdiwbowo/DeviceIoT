import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/apiservice';
import ModalEditProfile from '../components/profile/ModalEditProfile';
import ModalUpdatePassword from '../components/profile/ModalUpdatePassword';
import Swal from 'sweetalert2';
import Navbar from '../components/Navbar';

export default function UserProfile() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    imageProfile: '' // Pastikan ini konsisten
  });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      Swal.fire({
        title: 'Sedang Memuat...',
        text: 'Harap tunggu...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      try {
        const userProfile = await apiService.getUserProfile();
        setUser({
          name: userProfile.data.user.name || "Unknown",
          email: userProfile.data.user.email || "Email not available",
          phone: userProfile.data.user.phoneNumber || "Phone number not available",
          address: userProfile.data.user.address || "Address not available",
          imageProfile: userProfile.data.user.imageProfile || "https://via.placeholder.com/150", // Ganti ke imageProfile di sini
        });
      } catch (error) {
        Swal.fire('Error', error.message, 'error');
        if (error.message.includes('Unauthorized')) {
          navigate('/'); // Redirect to login page
        }
      } finally {
        Swal.close();
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleEditProfile = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleUpdateProfile = (updatedUser) => {
    setUser(updatedUser);
    setIsModalOpen(false);

    Swal.fire({
      title: 'Profil Berhasil Diperbarui!',
      text: 'Silahkan reload halaman.',
      icon: 'success',
      confirmButtonText: 'OK',
    });
  };

  const handleUpdatePassword = async (currentPassword, newPassword) => {
    try {
      const response = await apiService.updatePassword(user.email, currentPassword, newPassword);
      if (response.success) {
        Swal.fire({
          icon: 'success',
          title: 'Password berhasil diperbarui!',
          text: 'Silakan gunakan password baru Anda untuk masuk.',
        });
        setIsPasswordModalOpen(false);
      }
      return response;
    } catch (error) {
      Swal.fire('Error', error.message, 'error');
      return { success: false, message: error.message };
    }
  };

  if (loading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex items-center justify-center h-full mt-10">
        <div className="w-full max-w-3xl bg-white rounded-lg shadow-md border border-gray-300 p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Profil Pengguna</h1>
          <div className="flex flex-col items-center text-center">
            {/* Profile Image */}
            <img
              src={user.imageProfile} // Pastikan ini konsisten
              alt="Profile"
              className="w-32 h-32 rounded-full mb-4 object-cover border border-gray-300"
            />
            <h2 className="text-xl font-semibold text-gray-700">{user.name}</h2>
            <p className="text-gray-500 mb-2">{user.email}</p>
            <p className="text-gray-500 mb-2">{user.phone}</p>
            <p className="text-gray-500 mb-4">{user.address}</p>
            <div className="flex gap-4 mb-4">
              <button
                onClick={handleEditProfile}
                className="bg-blue-500 text-white py-2 px-4 rounded-md font-semibold hover:bg-blue-600 transition duration-200"
              >
                Edit Profil
              </button>
              <button
                onClick={() => setIsPasswordModalOpen(true)}
                className="bg-blue-500 text-white py-2 px-4 rounded-md font-semibold hover:bg-blue-600 transition duration-200"
              >
                Update Password
              </button>
            </div>
          </div>
          {isModalOpen && (
            <ModalEditProfile
              isOpen={isModalOpen}
              onClose={handleModalClose}
              user={user}
              onUpdate={handleUpdateProfile}
            />
          )}
          {isPasswordModalOpen && (
            <ModalUpdatePassword
              isOpen={isPasswordModalOpen}
              onClose={() => setIsPasswordModalOpen(false)}
              onUpdate={handleUpdatePassword}
            />
          )}
        </div>
      </div>
    </div>
  );
}