import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import apiService from '../services/apiservice';
import AddCompanyModal from '../components/company/AddCompanyModal';
import { FaPlus } from 'react-icons/fa';
import Swal from 'sweetalert2'; // Import SweetAlert2

export default function Companies() {
    const [showAddModal, setShowAddModal] = useState(false);
    const [companies, setCompanies] = useState([]);
    const [filteredCompanies, setFilteredCompanies] = useState([]);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const fetchCompanies = async () => {
        try {
            const data = await apiService.getAllCompanies();
            if (Array.isArray(data)) {
                setCompanies(data);
                setFilteredCompanies(data);
            } else {
                Swal.fire('Error', 'Unexpected data format.', 'error'); // SweetAlert for unexpected data
                setError('Unexpected data format.');
            }
        } catch (error) {
            Swal.fire('Error', 'Failed to fetch companies.', 'error'); // SweetAlert for fetch error
            setError('Failed to fetch companies.');
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    useEffect(() => {
        const filtered = companies.filter(company =>
            company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            company.code.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredCompanies(filtered);
        setCurrentPage(1); // Reset to first page on new search
    }, [searchQuery, companies]);

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredCompanies.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleAddCompany = async (newCompany) => {
        try {
            await apiService.addCompany(newCompany);
            setSuccessMessage('Company added successfully.');
            Swal.fire('Success', 'Company added successfully.', 'success'); // SweetAlert for success
            fetchCompanies(); // Refresh the list
        } catch (error) {
            Swal.fire('Error', 'Failed to add company.', 'error'); // SweetAlert for add error
            setError('Failed to add company.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <Navbar />
            <div className="container mx-auto py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Companies</h1>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                    >
                        <FaPlus className="mr-2" /> Add Company
                    </button>
                </div>
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Search companies..."
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
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Company GUID</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Code</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {currentItems.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500 dark:text-gray-300">
                                        No companies found
                                    </td>
                                </tr>
                            ) : (
                                currentItems.map((item, index) => (
                                    <tr key={item.guid || index} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{indexOfFirstItem + index + 1}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{item.guid}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{item.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{item.code}</td>
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

                <AddCompanyModal
                    showModal={showAddModal}
                    onClose={() => setShowAddModal(false)}
                    onSave={handleAddCompany}
                />
            </div>
        </div>
    );
}
