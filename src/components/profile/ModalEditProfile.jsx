import React, { useState } from 'react';
import InputMask from 'react-input-mask';
import updateUserProfile from '../../services/apiservice';
import Swal from 'sweetalert2';

export default function ModalEditProfile({ isOpen, onClose, user, onUpdate }) {
  const [name, setName] = useState(user.name);
  const [email] = useState(user.email); // Keep email read-only
  const [phoneNumber, setPhoneNumber] = useState(user.phone); // Use 'phoneNumber' for state
  const [address, setAddress] = useState(user.address);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const updatedUser = {
        name,
        phoneNumber, // Use 'phoneNumber' for the API call
        address,
      };
      
      await updateUserProfile(updatedUser);
      onUpdate(updatedUser);  // Call the onUpdate function passed as a prop

      // Show success message with SweetAlert
      Swal.fire({
        title: 'Berhasil!',
        text: 'Profil berhasil diperbarui.',
        icon: 'success',
        confirmButtonText: 'OK',
      });

      onClose();
    } catch (error) {
      // Show error message with SweetAlert
      Swal.fire({
        title: 'Gagal!',
        text: 'Gagal memperbarui profil. Silakan coba lagi.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="bg-white rounded-lg shadow-lg p-6 z-10 w-96">
        <h2 className="text-xl font-semibold mb-4">Edit Profil</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Nama</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border rounded w-full px-3 py-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              readOnly
              className="border rounded w-full px-3 py-2 bg-gray-100 cursor-not-allowed"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Nomor Telepon</label>
            <InputMask
              mask="(999) 999-9999"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)} // Update state correctly
              className="border rounded w-full px-3 py-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Alamat</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="border rounded w-full px-3 py-2"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <div className="flex justify-end">
            <button
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              onClick={onClose}
            >
              Batal
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 ml-4"
              disabled={loading}
            >
              {loading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
