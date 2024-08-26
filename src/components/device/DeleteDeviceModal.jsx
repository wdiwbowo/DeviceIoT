import React from 'react';

export default function DeleteDeviceModal({ isOpen, onClose, onDelete, deviceName }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg w-full max-w-md">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Delete Device</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Are you sure you want to delete the device "{deviceName}"?
                </p>
                <div className="flex justify-end mt-4">
                    <button
                        type="button"
                        className="bg-red-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
                        onClick={onDelete}
                    >
                        Delete
                    </button>
                    <button
                        type="button"
                        className="ml-4 bg-gray-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
