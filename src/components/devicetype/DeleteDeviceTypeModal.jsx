import React from 'react';
import PropTypes from 'prop-types';

const DeleteDeviceTypeModal = ({ show, onClose, onDelete, deviceType }) => {
    if (!show) return null;

    const deviceName = deviceType ? deviceType.name : 'Unknown Device Type';

    const onDelete = () => {
        if (deviceType && deviceType.guid) {
            onDelete(deviceType.guid);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-4">Delete Device Type</h2>
                <p className="mb-4">Are you sure you want to delete the device type <strong>{deviceName}</strong>?</p>
                <div className="flex justify-end">
                    <button
                        onClick={onDelete}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
                    >
                        Delete
                    </button>
                    <button onClick={onClose} className="ml-4 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg shadow-md hover:bg-gray-400 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">Cancel</button>
                </div>
            </div>
        </div>
    );
};

DeleteDeviceTypeModal.propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    deviceType: PropTypes.object,
};

export default DeleteDeviceTypeModal;
