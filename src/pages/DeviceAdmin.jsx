import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import apiService from '../services/apiservice';
import AddDeviceModal from "../components/deviceadmin/AddDeviceModal";
import EditDeviceModal from '../components/deviceadmin/EditDeviceModal';
import DeleteDeviceModal from '../components/deviceadmin/DeleteDeviceModal';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';

export default function Device() {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [devices, setDevices] = useState([]);
    const [filteredDevices, setFilteredDevices] = useState([]);
    const [deviceToEdit, setDeviceToEdit] = useState(null);
    const [deviceToDelete, setDeviceToDelete] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [selectedType, setSelectedType] = useState(""); // State for selected device type

    const fetchDevices = async () => {
        try {
            const response = await apiService.getAllDevicesCompany();
            if (response.success && Array.isArray(response.data.devices)) {
                setDevices(response.data.devices);
                setFilteredDevices(response.data.devices);
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
            (selectedType === "" || device.type === selectedType) // Filter by selected type
        );
        setFilteredDevices(filtered);
        setCurrentPage(1);
    }, [searchQuery, devices, selectedType]);

    const handleAddDevice = async (deviceData) => {
        try {
            await apiService.addDevices(deviceData);
            setShowAddModal(false);
            Swal.fire('Success', 'Device added successfully!', 'success');
            fetchDevices();
        } catch (error) {
            Swal.fire('Error', 'Failed to add device. Please try again.', 'error');
        }
    };

    const handleEditDevice = async (guid, updatedDeviceData) => {
        try {
            await apiService.updateDevice(guid, updatedDeviceData);
            setShowEditModal(false);
            Swal.fire('Success', 'Device updated successfully!', 'success');
            fetchDevices();
        } catch (error) {
            Swal.fire('Error', 'Failed to update device. Please try again.', 'error');
        }
    };

    const handleDeleteDevice = async () => {
        try {
            await apiService.deleteDeviceCompany(deviceToDelete.guid);
            setShowDeleteModal(false);
            Swal.fire('Success', 'Device deleted successfully!', 'success');
            fetchDevices();
        } catch (error) {
            Swal.fire('Error', 'Failed to delete device. Please try again.', 'error');
        }
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredDevices.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredDevices.length / itemsPerPage);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleTypeChange = (e) => {
        setSelectedType(e.target.value); // Update the selected type state
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
                <div className="flex mb-4 space-x-2">
                    <select
                        value={selectedType}
                        onChange={handleTypeChange}
                        className="px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                        <option value="">All Types</option>
                        <option value="Type1">Type 1</option>
                        <option value="Type2">Type 2</option>
                        {/* Add more types as needed */}
                    </select>
                    <input
                        type="text"
                        placeholder="Search devices..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="flex-1 px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
                                    <td colSpan="10" className="px-6 py-4 text-center text-gray-500 dark:text-gray-300">
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
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{item.status}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{item.active ? "Yes" : "No"}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                            <button onClick={() => { setDeviceToEdit(item); setShowEditModal(true); }} className="text-blue-600 dark:text-blue-400 hover:underline"><FaEdit /></button>
                                            <button onClick={() => { setDeviceToDelete(item); setShowDeleteModal(true); }} className="ml-4 text-red-600 dark:text-red-400 hover:underline"><FaTrash /></button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="mt-4 flex justify-between">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 text-white bg-blue-600 rounded-md disabled:bg-gray-400"
                    >
                        Previous
                    </button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 text-white bg-blue-600 rounded-md disabled:bg-gray-400"
                    >
                        Next
                    </button>
                </div>
            </div>
            {showAddModal && <AddDeviceModal onClose={() => setShowAddModal(false)} onAdd={handleAddDevice} />}
            {showEditModal && <EditDeviceModal device={deviceToEdit} onClose={() => setShowEditModal(false)} onEdit={handleEditDevice} />}
            {showDeleteModal && <DeleteDeviceModal device={deviceToDelete} onClose={() => setShowDeleteModal(false)} onDelete={handleDeleteDevice} />}
        </div>
    );
}
