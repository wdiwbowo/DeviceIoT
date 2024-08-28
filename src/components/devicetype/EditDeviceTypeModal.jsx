import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const EditDeviceTypeModal = ({ show, onClose, deviceType, onUpdate }) => {
    const [name, setName] = useState('');
    const [active, setActive] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (deviceType) {
            setName(deviceType.name || '');
            setActive(deviceType.active || true);
        }
    }, [deviceType]);

    const handleUpdate = () => {
        if (!name.trim()) {
            setError('Name is required.');
            return;
        }
        setError('');
        onUpdate({ ...deviceType, name, active });
        setName('');
        setActive(true);
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-4">Edit Device Type</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Active</label>
                    <select
                        value={active}
                        onChange={(e) => setActive(JSON.parse(e.target.value))}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                    >
                        <option value={true}>Yes</option>
                        <option value={false}>No</option>
                    </select>
                </div>
                <div className="flex justify-end">
                    <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 mr-2">Cancel</button>
                    <button onClick={handleUpdate} className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">Update</button>
                </div>
            </div>
        </div>
    );
};

EditDeviceTypeModal.propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    deviceType: PropTypes.object.isRequired,
    onUpdate: PropTypes.func.isRequired,
};

export default EditDeviceTypeModal;
