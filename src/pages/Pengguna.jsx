import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import apiService from '../services/apiservice';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import AddUserModal from "../components/pengguna/AddUserModal";
import Swal from 'sweetalert2'; // Import SweetAlert2

export default function Pengguna() {
    const [penggunas, setPenggunas] = useState([]);
    const [filteredPenggunas, setFilteredPenggunas] = useState([]);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setModalOpen] = useState(false);
    const itemsPerPage = 5;

    const fetchPenggunas = async () => {
        try {
            const response = await apiService.getAllUser();
            if (response.success && Array.isArray(response.data.users)) {
                setPenggunas(response.data.users);
                setFilteredPenggunas(response.data.users);
            } else {
                Swal.fire('Error', 'Data fetched is not an array', 'error'); // Show error alert
            }
        } catch (error) {
            Swal.fire('Error', 'Failed to fetch pengguna.', 'error'); // Show error alert
        }
    };

    useEffect(() => {
        fetchPenggunas();
    }, []);

    useEffect(() => {
        const filtered = penggunas.filter(pengguna =>
            pengguna.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            pengguna.guid.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredPenggunas(filtered);
        setCurrentPage(1); // Reset to first page on new search
    }, [searchQuery, penggunas]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredPenggunas.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredPenggunas.length / itemsPerPage);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleAddUser = async (userData) => {
        if (userData.name && userData.email && userData.phoneNumber) {
            try {
                const response = await apiService.addUser(userData);
                if (response.success) {
                    setPenggunas([...penggunas, response.data.user]);
                    setFilteredPenggunas([...penggunas, response.data.user]);
                    Swal.fire('Success', 'User berhasil ditambahkan!', 'success'); // Show success alert
                    setModalOpen(false);
                } else {
                    Swal.fire('Error', 'Failed to add user.', 'error'); // Show error alert
                }
            } catch (error) {
                Swal.fire('Error', 'Failed to add user.', 'error'); // Show error alert
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <Navbar />
            <div className="container mx-auto py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Pengguna</h1>
                    <button
                        onClick={() => setModalOpen(true)}
                        className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                    >
                        <FaPlus className="mr-2" /> Add Pengguna
                    </button>
                </div>
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Search penggunas..."
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
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">NAME</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">EMAIL</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Phone</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {currentItems.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500 dark:text-gray-300">
                                        No penggunas found
                                    </td>
                                </tr>
                            ) : (
                                currentItems.map((item, index) => (
                                    <tr key={item.guid || index} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                            {indexOfFirstItem + index + 1}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                            {item.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                            {item.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                            {item.phoneNumber}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <button className="flex items-center bg-blue-600 text-white px-3 py-2 rounded-md shadow-sm hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
                                                    <FaEdit className="mr-2" /> Edit
                                                </button>
                                                <button className="flex items-center bg-red-600 text-white px-3 py-2 rounded-md shadow-sm hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600">
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
            </div>

            {/* AddUserModal component */}
            <AddUserModal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                onAddUser={handleAddUser}
            />
        </div>
    );
}
