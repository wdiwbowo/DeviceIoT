import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import apiService from '../services/apiservice';
import AddTypeModal from '../components/type/AddTypeModal';
import EditTypeModal from '../components/type/EditTypeModal';
import DeleteTypeModal from '../components/type/DeleteTypeModal';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa'; // Import the icons
import Swal from 'sweetalert2'; // Import SweetAlert2

export default function TypeAdmin() {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [types, setTypes] = useState([]);
    const [filteredTypes, setFilteredTypes] = useState([]);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [typeToEdit, setTypeToEdit] = useState(null);
    const [typeToDelete, setTypeToDelete] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const fetchTypes = async () => {
        try {
            const response = await apiService.getAllDeviceTypes(); // Adjust this to your API endpoint for types
            if (response.success && Array.isArray(response.data.types)) {
                setTypes(response.data.types);
                setFilteredTypes(response.data.types);
            } else {
                Swal.fire('Error', 'Data fetched is not an array', 'error');
            }
        } catch (error) {
            Swal.fire('Error', 'Failed to fetch types.', 'error');
        }
    };

    useEffect(() => {
        fetchTypes();
    }, []);

    useEffect(() => {
        const filtered = types.filter(type =>
            type.name.toLowerCase().includes(searchQuery.toLowerCase()) // Adjust to the property you want to search by
        );
        setFilteredTypes(filtered);
        setCurrentPage(1); // Reset to first page on new search
    }, [searchQuery, types]);

    const handleAddType = async (typeData) => {
        try {
            await apiService.addDeviceType(typeData); // Adjust this to your API service for adding types
            setShowAddModal(false);
            Swal.fire('Success', 'Type added successfully!', 'success');
            fetchTypes(); // Refresh types list
        } catch (error) {
            Swal.fire('Error', 'Failed to add type. Please try again.', 'error');
        }
    };

    const handleEditType = async (guid, updatedTypeData) => {
        try {
            await apiService.updateDeviceType(guid, updatedTypeData); // Adjust this to your API service for updating types
            setShowEditModal(false);
            Swal.fire('Success', 'Type updated successfully!', 'success');
            fetchTypes(); // Refresh types list
        } catch (error) {
            Swal.fire('Error', 'Failed to update type. Please try again.', 'error');
        }
    };

    const handleDeleteType = async () => {
        try {
            await apiService.deleteDeviceType(typeToDelete.guid); // Adjust this to your API service for deleting types
            setShowDeleteModal(false);
            Swal.fire('Success', 'Type deleted successfully!', 'success');
            fetchTypes(); // Refresh types list
        } catch (error) {
            Swal.fire('Error', 'Failed to delete type. Please try again.', 'error');
        }
    };

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredTypes.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredTypes.length / itemsPerPage);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <Navbar />
            <div className="container mx-auto py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Device Types</h1>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                    >
                        <FaPlus className="mr-2" /> Add Type
                    </button>
                </div>
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Search types..."
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
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type GUID</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {currentItems.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500 dark:text-gray-300">
                                        No types found
                                    </td>
                                </tr>
                            ) : (
                                currentItems.map((type, index) => (
                                    <tr key={type.guid}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{index + 1 + indexOfFirstItem}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{type.guid}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{type.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                            <button onClick={() => { setTypeToEdit(type); setShowEditModal(true); }} className="text-blue-500 hover:text-blue-700 mr-2">
                                                <FaEdit />
                                            </button>
                                            <button onClick={() => { setTypeToDelete(type); setShowDeleteModal(true); }} className="text-red-500 hover:text-red-700">
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

            {showAddModal && <AddTypeModal onClose={() => setShowAddModal(false)} onAdd={handleAddType} />}
            {showEditModal && <EditTypeModal type={typeToEdit} onClose={() => setShowEditModal(false)} onEdit={handleEditType} />}
            {showDeleteModal && <DeleteTypeModal type={typeToDelete} onClose={() => setShowDeleteModal(false)} onDelete={handleDeleteType} />}
        </div>
    );
}
