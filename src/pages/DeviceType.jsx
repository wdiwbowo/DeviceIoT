import React, { useEffect, useState } from 'react';
import apiService from '../services/apiservice';
import Navbar from '../components/Navbar';
import AddDeviceTypeModal from '../components/devicetype/AddDeviceTypeModal';
import EditDeviceTypeModal from '../components/devicetype/EditDeviceTypeModal';
import DeleteDeviceTypeModal from '../components/devicetype/DeleteDeviceTypeModal';
import debounce from 'lodash.debounce';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const DeviceTypes = () => {
    const [deviceTypes, setDeviceTypes] = useState([]);
    const [filteredDeviceTypes, setFilteredDeviceTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [currentDeviceType, setCurrentDeviceType] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchDeviceTypes = async () => {
            try {
                const response = await apiService.getDeviceTypes();
                setDeviceTypes(response.data);
                setFilteredDeviceTypes(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch device types.');
                setLoading(false);
            }
        };

        fetchDeviceTypes();
    }, []);

    const handleAddDeviceType = async (deviceType) => {
        try {
            await apiService.addDeviceType(deviceType);
            const response = await apiService.getDeviceTypes();
            setDeviceTypes(response.data);
            setFilteredDeviceTypes(response.data);
            setSuccessMessage('Device type added successfully.');
            setShowAddModal(false);  // Close modal after success
        } catch (err) {
            setError('Failed to add device type.');
        }
    };

    const handleUpdateDeviceType = async (deviceType) => {
        try {
            await apiService.updateDeviceType(deviceType.guid, deviceType);
            const response = await apiService.getDeviceTypes();
            setDeviceTypes(response.data);
            setFilteredDeviceTypes(response.data);
            setSuccessMessage('Device type updated successfully.');
            setShowEditModal(false);  // Close modal after success
        } catch (err) {
            setError('Failed to update device type.');
        }
    };

    const handleDeleteDeviceType = async (guid) => {
        try {
            await apiService.deleteDeviceType(guid);
            const response = await apiService.getDeviceTypes();
            setDeviceTypes(response.data);
            setFilteredDeviceTypes(response.data);
            setSuccessMessage('Device type deleted successfully.');
            setShowDeleteModal(false);  // Close modal after success
        } catch (err) {
            setError('Failed to delete device type.');
        }
    };

    const handleSearch = debounce((term) => {
        const lowercasedTerm = term.toLowerCase();
        const filtered = deviceTypes.filter((type) =>
            type.name.toLowerCase().includes(lowercasedTerm)
        );
        setFilteredDeviceTypes(filtered);
        setCurrentPage(1);
    }, 300);

    useEffect(() => {
        handleSearch(searchTerm);
    }, [searchTerm, deviceTypes]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredDeviceTypes.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredDeviceTypes.length / itemsPerPage);

    return (
        <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
            <Navbar />
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Device Types</h1>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                    >
                        <FaPlus className="mr-2" /> Add Device
                    </button>
                </div>

                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Search Device Types..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                    />
                </div>
                {loading && <p>Loading...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {successMessage && <p className="text-green-500">{successMessage}</p>}
                <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-md mt-4">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">#</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Active</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">GUID</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {currentItems.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500 dark:text-gray-300">
                                        No device types found
                                    </td>
                                </tr>
                            ) : (
                                currentItems.map((type, index) => (
                                    <tr key={type.guid || index} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                            {indexOfFirstItem + index + 1}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{type.name || 'N/A'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{type.active !== undefined ? (type.active ? "Yes" : "No") : 'N/A'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{type.guid || 'N/A'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-2">
                                            <button
                                                onClick={() => {
                                                    setCurrentDeviceType(type);
                                                    setShowEditModal(true);
                                                }}
                                                className="flex items-center bg-blue-600 text-white px-3 py-2 rounded-md shadow-sm hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                                            >
                                                <FaEdit className="mr-2" /> Edit
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setCurrentDeviceType(type);
                                                    setShowDeleteModal(true);
                                                }}
                                                className="flex items-center bg-red-600 text-white px-3 py-2 rounded-md shadow-sm hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
                                            >
                                                <FaTrash className="mr-2" /> Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-between items-center mt-6">
                    <button
                        className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 px-4 py-2 rounded-lg shadow-md disabled:opacity-50"
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <span className="text-gray-700 dark:text-gray-300">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 px-4 py-2 rounded-lg shadow-md disabled:opacity-50"
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
                <AddDeviceTypeModal
                    show={showAddModal}
                    onClose={() => setShowAddModal(false)}
                    onAdd={handleAddDeviceType}
                />
                {currentDeviceType && (
                    <EditDeviceTypeModal
                        show={showEditModal}
                        onClose={() => setShowEditModal(false)}
                        deviceType={currentDeviceType}
                        onUpdate={handleUpdateDeviceType}
                    />
                )}
                {currentDeviceType && (
                    <DeleteDeviceTypeModal
                        show={showDeleteModal}
                        onClose={() => setShowDeleteModal(false)}
                        deviceType={currentDeviceType}
                        onDelete={handleDeleteDeviceType}
                    />
                )}
            </div>
        </div>
    );
};

export default DeviceTypes;
