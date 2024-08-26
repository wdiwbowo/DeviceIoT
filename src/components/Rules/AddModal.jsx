import React from 'react';

const AddModal = ({ isOpen, onClose, onSave, guidInput, setGuidInput, valueInput, setValueInput, guidOutput, setGuidOutput, valueOutput, setValueOutput }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-lg">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Add Rule</h2>
                <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">GUID Input</label>
                    <input
                        type="text"
                        className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        value={guidInput}
                        onChange={(e) => setGuidInput(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">Value Input</label>
                    <input
                        type="text"
                        className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        value={valueInput}
                        onChange={(e) => setValueInput(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">GUID Output</label>
                    <input
                        type="text"
                        className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        value={guidOutput}
                        onChange={(e) => setGuidOutput(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">Value Output</label>
                    <input
                        type="text"
                        className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        value={valueOutput}
                        onChange={(e) => setValueOutput(e.target.value)}
                    />
                </div>
                <div className="flex justify-end">
                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
                        onClick={onSave}
                    >
                        Save
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

export default AddModal;
