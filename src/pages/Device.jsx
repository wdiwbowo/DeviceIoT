import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import apiService from '../services/apiservice';
import AddDeviceModal from '../components/device/AddDeviceModal';
import EditDeviceModal from '../components/device/EditDeviceModal';
import DeleteDeviceModal from '../components/device/DeleteDeviceModal';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa'; // Import the icons
import Swal from 'sweetalert2'; // Import SweetAlert2

export default function Device() {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [devices, setDevices] = useState([]);
    const [filteredDevices, setFilteredDevices] = useState([]);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [deviceToEdit, setDeviceToEdit] = useState(null);
    const [deviceToDelete, setDeviceToDelete] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [selectedType, setSelectedType] = useState("All"); // State for selected device type
    const [deviceTypes, setDeviceTypes] = useState([]); // State for device types

    const fetchDevices = async () => {
        try {
            const response = await apiService.getAllDevices();
            if (response.success && Array.isArray(response.data.devices)) {
                setDevices(response.data.devices);
                setFilteredDevices(response.data.devices);
                // Assume you can get types from devices, modify this logic as needed
                const types = [...new Set(response.data.devices.map(device => device.type))];
                setDeviceTypes(["All", ...types]); // Add "All" to the types
            } else {
                Swal.fire('Error', 'Data fetched is not an array', 'error');
            }
        } catch (error) {
            Swal.fire('Error', 'Failed to fetch devices.', 'error');
        }
    };

    useEffect(() => {
        fetchDevices();
    }, []);

    useEffect(() => {
        const filtered = devices.filter(device =>
            (device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                device.deviceGuid.toLowerCase().includes(searchQuery.toLowerCase()) ||
                device.mac.toLowerCase().includes(searchQuery.toLowerCase())) &&
            (selectedType === "All" || device.type === selectedType) // Filter by type
        );
        setFilteredDevices(filtered);
        setCurrentPage(1); // Reset to first page on new search or filter
    }, [searchQuery, devices, selectedType]); // Add selectedType to dependencies

    const handleAddDevice = async (deviceData) => {
        try {
            await apiService.addDevice(deviceData);
            setShowAddModal(false);
            Swal.fire('Success', 'Device added successfully!', 'success');
            fetchDevices(); // Refresh devices list
        } catch (error) {
            Swal.fire('Error', 'Failed to add device. Please try again.', 'error');
        }
    };

    const handleEditDevice = async (guid, updatedDeviceData) => {
        try {
            await apiService.updateDevice(guid, updatedDeviceData);
            setShowEditModal(false);
            Swal.fire('Success', 'Device updated successfully!', 'success');
            fetchDevices(); // Refresh devices list
        } catch (error) {
            Swal.fire('Error', 'Failed to update device. Please try again.', 'error');
        }
    };

    const handleDeleteDevice = async () => {
        try {
            await apiService.deleteDevice(deviceToDelete.guid);
            setShowDeleteModal(false);
            Swal.fire('Success', 'Device deleted successfully!', 'success');
            fetchDevices(); // Refresh devices list
        } catch (error) {
            Swal.fire('Error', 'Failed to delete device. Please try again.', 'error');
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

    const handleTypeChange = (e) => {
        setSelectedType(e.target.value); // Update selected type
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
                <div className="mb-4 flex space-x-4">
                    <input
                        type="text"
                        placeholder="Search devices..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                    <select
                        value={selectedType}
                        onChange={handleTypeChange}
                        className="px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                        {deviceTypes.map((type, index) => (
                            <option key={index} value={type}>{type}</option>
                        ))}
                    </select>
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
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Active</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {currentItems.length === 0 ? (
                                <tr>
                                    <td colSpan="9" className="px-6 py-4 text-center text-gray-500 dark:text-gray-300">
                                        No devices found
                                    </td>
                                </tr>
                            ) : (
                                currentItems.map((device, index) => (
                                    <tr key={device.guid}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{index + 1 + indexOfFirstItem}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{device.deviceGuid}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{device.mac}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{device.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{device.type}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{device.latitude}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{device.longitude}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`font-semibold ${device.active ? 'text-green-500' : 'text-red-500'}`}>
                                                {device.active ? 'On' : 'Off'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                            <button onClick={() => { setDeviceToEdit(device); setShowEditModal(true); }} className="text-blue-500 hover:text-blue-700 mr-2">
                                                <FaEdit />
                                            </button>
                                            <button onClick={() => { setDeviceToDelete(device); setShowDeleteModal(true); }} className="text-red-500 hover:text-red-700">
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="mt-4 flex justify-between">
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
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
    );
}