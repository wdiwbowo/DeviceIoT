import React, { useState, useEffect } from 'react';
import apiService from '../../services/apiservice';

function EditDeviceModal({ showModal, onClose, device, onSave }) {
    const [deviceData, setDeviceData] = useState(device);
    const [saveMessage, setSaveMessage] = useState("");
    const [deviceTypes, setDeviceTypes] = useState([]); // Add state for device types
    const [error, setError] = useState(''); // Add state for errors
    const [loading, setLoading] = useState(true); // Add state for loading
    const [companies, setCompanies] = useState([]);

    useEffect(() => {
        setDeviceData(device);
    }, [device]);

    useEffect(() => {
        const fetchDeviceTypes = async () => {
            try {
                const response = await apiService.getDeviceTypes();
                setDeviceTypes(response.data); // Update with correct field from response
                setLoading(false);
            } catch (err) {
                console.error("Error fetching device types:", err); // Log detailed error
                setError('Failed to fetch device types.');
                setLoading(false);
            }
        };

        const fetchCompanies = async () => {
            try {
                const data = await apiService.getAllCompanies();
                if (Array.isArray(data)) {
                    setCompanies(data);
                } else {
                    console.error('Data fetched is not an array:', data);
                    setError('Unexpected data format.');
                }
            } catch (error) {
                console.error('Error fetching companies:', error);
                setError('Failed to fetch companies.');
            }
        };

        fetchDeviceTypes();
        fetchCompanies();
        setLoading(false); 
    }, []);

    

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setDeviceData((prevState) => ({
            ...prevState,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSave = async () => {
        // console.log('Device data on save:', deviceData); // Debugging

        // Simple validation
        if (!deviceData.guid) {
            alert("GUID diperlukan untuk pembaruan perangkat.");
            return;
        }
        if (!deviceData.mac || !deviceData.name) {
            alert("MAC Address dan Name diperlukan.");
            return;
        }

        try {
            await onSave(deviceData.guid, deviceData); // Use deviceGuid for updating
            setSaveMessage("Perangkat berhasil disimpan!");
            setTimeout(() => {
                setSaveMessage("");
                onClose();
            }, 2000); // Close modal after 2 seconds
        } catch (error) {
            alert(`Error menyimpan perangkat: ${error.message || "Kesalahan tidak dikenal"}`);
        }
    };

    if (!showModal) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg w-full max-w-3xl">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Edit Device</h2>
                {saveMessage && (
                    <div className="bg-green-100 text-green-700 p-2 mb-4 rounded-md">
                        {saveMessage}
                    </div>
                )}
                {error && (
                    <div className="bg-red-100 text-red-700 p-2 mb-4 rounded-md">
                        {error}
                    </div>
                )}
                <form className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">GUID</label>
                            <select
                                    name="companyGuid"
                                    value={deviceData.companyGuid}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                >
                                    <option value="">Select company</option>
                                    {companies.map(company => (
                                        <option key={company.guid} value={company.guid}>
                                            {company.name}
                                        </option>
                                    ))}
                                </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">GUID</label>
                            <input
                                type="text"
                                name="deviceGuid"
                                value={deviceData.deviceGuid}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                readOnly
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">MAC Address</label>
                            <input
                                type="text"
                                name="mac"
                                value={deviceData.mac}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={deviceData.name}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
                            <select
                                name="type"
                                value={deviceData.type}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                                <option value="">Select Type</option>
                                {deviceTypes.map((deviceType) => (
                                    <option key={`${deviceType.id}-${deviceType.name}`} value={deviceType.name}>
                                        {deviceType.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Latitude</label>
                            <input
                                type="text"
                                name="latitude"
                                value={deviceData.latitude}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Longitude</label>
                            <input
                                type="text"
                                name="longitude"
                                value={deviceData.longitude}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Sensor Unit</label>
                            <input
                                type="text"
                                name="sensorUnit"
                                value={deviceData.sensorUnit}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Image URL</label>
                            <input
                                type="text"
                                name="image"
                                value={deviceData.image}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="status"
                                checked={deviceData.status}
                                onChange={handleChange}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label className="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="active"
                                checked={deviceData.active}
                                onChange={handleChange}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label className="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Active</label>
                        </div>
                    </div>
                    <div className="flex justify-end mt-4">
                        <button
                            type="button"
                            className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                            onClick={handleSave}
                        >
                            Save Changes
                        </button>
                        <button
                            type="button"
                            className="ml-4 bg-gray-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditDeviceModal;
