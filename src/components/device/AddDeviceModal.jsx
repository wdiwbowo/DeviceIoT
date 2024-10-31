import React, { useState, useEffect } from 'react';
import apiService from '../../services/apiservice';

export default function AddDeviceModal({ showModal, onClose, onSave }) {
    const [deviceData, setDeviceData] = useState({
        companyGuid: "",
        deviceGuid: "",
        mac: "",
        name: "",
        type: "",
        latitude: "",
        longitude: "",
        sensorUnit: "",
        status: false,
        active: false,
        image: ""
    });

    const [deviceTypes, setDeviceTypes] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDeviceTypes = async () => {
            try {
                const response = await apiService.getDeviceTypes();
                setDeviceTypes(response.data);
            } catch (err) {
                console.error("Error fetching device types:", err);
                setError('Failed to fetch device types.');
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
        setLoading(false); // Set loading to false after both fetches
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setDeviceData(prevState => ({
            ...prevState,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSave = () => {
        if (!deviceData.companyGuid || !deviceData.deviceGuid || !deviceData.name) {
            setError('Please fill out all required fields.');
            return;
        }

        onSave(deviceData);
        resetForm();
        onClose(); // Close modal after saving
    };

    const resetForm = () => {
        setDeviceData({
            companyGuid: "",
            deviceGuid: "",
            mac: "",
            name: "",
            type: "",
            latitude: "",
            longitude: "",
            sensorUnit: "",
            status: false,
            active: false,
            image: ""
        });
        setError(null);
    };

    if (!showModal) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg w-full max-w-3xl">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Add Device</h2>
                {loading ? (
                    <p className="text-gray-700 dark:text-gray-300">Loading...</p>
                ) : (
                    <form className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Company GUID</label>
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
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Device GUID</label>
                                <input
                                    type="text"
                                    name="deviceGuid"
                                    value={deviceData.deviceGuid}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    required
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
                                    {deviceTypes.map(deviceType => (
                                        <option key={deviceType.guid} value={deviceType.name}>
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
                            <div className="col-span-2">
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

                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={onClose} // Close modal
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-500 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSave} // Save data
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Save
                            </button>
                        </div>
                        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    </form>
                )}
            </div>
        </div>
    );
}
