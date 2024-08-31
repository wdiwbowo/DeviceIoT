import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import apiService from '../services/apiservice';
import AddDeviceModal from "../components/deviceadmin/AddDeviceModal";
import EditDeviceModal from '../components/deviceadmin/EditDeviceModal';
import DeleteDeviceModal from '../components/deviceadmin/DeleteDeviceModal';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa'; // Import the icons

export default function Device() {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [devices, setDevices] = useState([]);
    const [filteredDevices, setFilteredDevices] = useState([]);
    const [error, setError] = useState(null);
    const [deviceToEdit, setDeviceToEdit] = useState(null);
    const [deviceToDelete, setDeviceToDelete] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const fetchDevices = async () => {
        try {
            const response = await apiService.getAllDevicesCompany();
            if (response.success && Array.isArray(response.data.devices)) {
                setDevices(response.data.devices);
                setFilteredDevices(response.data.devices);
            } else {
                console.error('Data fetched is not an array:', response);
            }
        } catch (error) {
            console.error('Error fetching devices:', error);
            setError('Failed to fetch devices.');
        }
    };

    useEffect(() => {
        fetchDevices();
    }, []);

    useEffect(() => {
        const filtered = devices.filter(device =>
            device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            device.deviceGuid.toLowerCase().includes(searchQuery.toLowerCase()) ||
            device.mac.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredDevices(filtered);
        setCurrentPage(1); // Reset to first page on new search
    }, [searchQuery, devices]);

    const handleAddDevice = async (deviceData) => {
        try {
            await apiService.addDevice(deviceData);
            setShowAddModal(false);
            setSuccessMessage("Device added successfully!");
            fetchDevices(); // Refresh devices list
        } catch (error) {
            setError("Failed to add device. Please try again.");
        }
    };

    const handleEditDevice = async (guid, updatedDeviceData) => {
        try {
            await apiService.updateDevice(guid, updatedDeviceData);
            setShowEditModal(false);
            setSuccessMessage("Device updated successfully!");
            fetchDevices(); // Refresh devices list
        } catch (error) {
            setError("Failed to update device. Please try again.");
        }
    };

    const handleDeleteDevice = async () => {
        try {
            await apiService.deleteDeviceCompany(deviceToDelete.guid);
            setShowDeleteModal(false);
            setSuccessMessage("Device deleted successfully!");
            fetchDevices(); // Refresh devices list
        } catch (error) {
            setError("Failed to delete device. Please try again.");
        }
    };

    // Mengatur timeout untuk menghilangkan pesan setelah 2 detik
    useEffect(() => {
        if (successMessage || error) {
            const timer = setTimeout(() => {
                setSuccessMessage(null);
                setError(null);
            }, 2000); // 2000 ms = 2 detik

            return () => clearTimeout(timer);
        }
    }, [successMessage, error]);

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredDevices.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredDevices.length / itemsPerPage);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <Navbar />
            <div className="container mx-auto py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Devices</h1>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                    >
                        <FaPlus className="mr-2" /> Add Device
                    </button>
                </div>
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Search devices..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                </div>
                <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-md">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">#</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Device GUID</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">MAC Address</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Latitude</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Longitude</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Active</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {currentItems.length === 0 ? (
                                <tr>
                                    <td colSpan="11" className="px-6 py-4 text-center text-gray-500 dark:text-gray-300">
                                        No devices found
                                    </td>
                                </tr>
                            ) : (
                                currentItems.map((item, index) => (
                                    <tr key={item.deviceGuid || index} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{indexOfFirstItem + index + 1}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{item.deviceGuid}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{item.mac}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{item.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{item.type}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{item.latitude}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{item.longitude}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{item.status ? 'True' : 'False'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{item.active ? 'Active' : 'Inactive'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => {
                                                        setDeviceToEdit(item);
                                                        setShowEditModal(true);
                                                    }}
                                                    className="flex items-center bg-blue-600 text-white px-3 py-2 rounded-md shadow-sm hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                                                >
                                                    <FaEdit className="mr-2" /> Edit
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setDeviceToDelete(item);
                                                        setShowDeleteModal(true);
                                                    }}
                                                    className="flex items-center bg-red-600 text-white px-3 py-2 rounded-md shadow-sm hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
                                                >
                                                    <FaTrash className="mr-2" /> Delete
                                                </button>
                                            </div>
                                        </td>

                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {error && (
                    <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
                        <p>{error}</p>
                    </div>
                )}

                {successMessage && (
                    <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
                        <p>{successMessage}</p>
                    </div>
                )}

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

                <AddDeviceModal
                    showModal={showAddModal}
                    onClose={() => setShowAddModal(false)}
                    onSave={handleAddDevice}
                />
                {deviceToEdit && (
                    <EditDeviceModal
                        showModal={showEditModal}
                        onClose={() => setShowEditModal(false)}
                        device={deviceToEdit}
                        onSave={handleEditDevice}
                    />
                )}
                  {deviceToDelete && (
                    <DeleteDeviceModal
                        isOpen={showDeleteModal}
                        onClose={() => setShowDeleteModal(false)}
                        device={deviceToDelete}
                        onDelete={handleDeleteDevice}
                    />
                )}
            </div>
        </div>
    );
}
