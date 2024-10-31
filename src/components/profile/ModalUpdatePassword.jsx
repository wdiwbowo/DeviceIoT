import React, { useState } from 'react';
import Swal from 'sweetalert2';

export default function ModalUpdatePassword({ isOpen, onClose, onUpdate }) {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const response = await onUpdate(currentPassword, newPassword);
        if (response.success) {
            // Show success message with SweetAlert
            Swal.fire({
                title: 'Berhasil!',
                text: response.message,
                icon: 'success',
                confirmButtonText: 'OK'
            });
            onClose(); // Close the modal on success
        } else {
            // Show error message with SweetAlert
            setError(response.message);
            Swal.fire({
                title: 'Gagal!',
                text: response.message,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-black bg-opacity-70 w-full h-full absolute" onClick={onClose} />
            <div className="relative bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md z-10">
                <h2 className="text-xl font-bold mb-4">Update Password</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="currentPassword" className="block mb-2">Current Password</label>
                        <input
                            type="password"
                            id="currentPassword"
                            className="w-full border border-gray-300 p-2 rounded"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="newPassword" className="block mb-2">New Password</label>
                        <input
                            type="password"
                            id="newPassword"
                            className="w-full border border-gray-300 p-2 rounded"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <button
                        type="submit"
                        className="w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600 transition"
                    >
                        Update Password
                    </button>
                </form>
                <button
                    className="absolute top-2 right-2 text-gray-600"
                    onClick={onClose}
                >
                    &times;
                </button>
            </div>
        </div>
    );
}
