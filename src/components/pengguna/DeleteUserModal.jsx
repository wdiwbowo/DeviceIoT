import React from 'react';

export default function DeleteUserModal({ isOpen, onClose, onConfirm, user }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-80">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Confirm Deletion</h2>
                <p className="mb-4 text-gray-600 dark:text-gray-300">
                    Are you sure you want to delete {user?.name}?
                </p>
                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 mr-2 bg-gray-300 text-gray-800 rounded-md dark:bg-gray-700 dark:text-gray-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
