import React from 'react';

const DeleteModal = ({ isOpen, onClose, onDelete }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-lg">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Delete Rule</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">Are you sure you want to delete this rule?</p>
                <div className="flex justify-end">
                    <button
                        className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 mr-2"
                        onClick={onDelete}
                    >
                        Delete
                    </button>
                    <button
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg shadow-md hover:bg-gray-400 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteModal;