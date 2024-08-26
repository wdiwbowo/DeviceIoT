import React, { useState, useEffect, useCallback } from "react";
import Navbar from "../components/Navbar";
import apiService from "../services/apiservice";
import debounce from "lodash.debounce";

const Rules = () => {
    const [showModal, setShowModal] = useState(false);
    const [guidInput, setGuidInput] = useState("");
    const [valueInput, setValueInput] = useState("");
    const [guidOutput, setGuidOutput] = useState("");
    const [valueOutput, setValueOutput] = useState("");
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // Define how many items per page

    // Fetch data from API on component mount
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await apiService.getAllRules();
                setData(response.data);
                setFilteredData(response.data);
            } catch (error) {
                setErrorMessage(error.message || "Failed to fetch rules data.");
                console.error("Error fetching rules data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Debounced search function
    const handleSearch = useCallback(
        debounce((term) => {
            const results = data.filter((item) =>
                item.guidInput.toLowerCase().includes(term.toLowerCase()) ||
                item.valueInput.toLowerCase().includes(term.toLowerCase()) ||
                item.guidOutput.toLowerCase().includes(term.toLowerCase()) ||
                item.valueOutput.toLowerCase().includes(term.toLowerCase())
            );
            setFilteredData(results);
            setCurrentPage(1); // Reset to the first page when searching
        }, 300), // Adjust debounce delay as needed
        [data]
    );

    // Update search term and trigger debounced search
    useEffect(() => {
        handleSearch(searchTerm);
    }, [searchTerm, handleSearch]);

    // Handle save rule
    const handleSave = async () => {
        setLoading(true);
        setErrorMessage("");
        setSuccessMessage("");
        try {
            const response = await apiService.addRule(guidInput, valueInput, guidOutput, valueOutput);
            console.log('Rule added successfully:', response);
            const newRule = { guidInput, valueInput, guidOutput, valueOutput };
            setData([...data, newRule]);
            setFilteredData([...filteredData, newRule]);
            setSuccessMessage("Rule added successfully!");
            setShowModal(false);
        } catch (error) {
            setErrorMessage(error.message || "Failed to add rule.");
            console.error('Failed to add rule:', error);
        } finally {
            setLoading(false);
        }
    };

    // Pagination calculations
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <Navbar />
            <div className="container mx-auto py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Rules</h1>
                    <button
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onClick={() => setShowModal(true)}
                    >
                        Add Rule
                    </button>
                </div>

                {/* Search input */}
                <div className="mb-4">
                    <input
                        type="text"
                        className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="Search rules..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {loading && <p>Loading...</p>}
                {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                {successMessage && <p className="text-green-500">{successMessage}</p>}

                {!loading && !errorMessage && (
                    <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">#</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Guide Input</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Value Input</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Guide Output</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Value Output</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {paginatedData.map((item, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{item.guidInput}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{item.valueInput}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{item.guidOutput}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{item.valueOutput}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-600 mr-4">Edit</button>
                                            <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-600">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
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

            {showModal && (
                <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-center justify-center min-h-screen px-4">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden transform transition-all sm:max-w-lg sm:w-full">
                            <div className="px-6 py-5">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 id="modal-title" className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Add New Rule</h3>
                                        <div className="mt-2">
                                            <input
                                                type="text"
                                                className="w-full px-4 py-2 mt-4 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                                placeholder="Guide Input"
                                                value={guidInput}
                                                onChange={(e) => setGuidInput(e.target.value)}
                                            />
                                            <input
                                                type="text"
                                                className="w-full px-4 py-2 mt-4 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                                placeholder="Value Input"
                                                value={valueInput}
                                                onChange={(e) => setValueInput(e.target.value)}
                                            />
                                            <input
                                                type="text"
                                                className="w-full px-4 py-2 mt-4 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                                placeholder="Guide Output"
                                                value={guidOutput}
                                                onChange={(e) => setGuidOutput(e.target.value)}
                                            />
                                            <input
                                                type="text"
                                                className="w-full px-4 py-2 mt-4 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                                placeholder="Value Output"
                                                value={valueOutput}
                                                onChange={(e) => setValueOutput(e.target.value)}
                                            />
                                            {errorMessage && (
                                                <div className="text-red-500 text-sm mt-4">{errorMessage}</div>
                                            )}
                                            {successMessage && (
                                                <div className="text-green-500 text-sm mt-4">{successMessage}</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 ${loading ? 'bg-gray-400' : 'bg-blue-600'} text-white text-base font-medium focus:outline-none sm:ml-3 sm:w-auto sm:text-sm`}
                                    onClick={handleSave}
                                    disabled={loading}
                                >
                                    {loading ? 'Saving...' : 'Save'}
                                </button>
                                <button
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white dark:bg-gray-600 text-gray-700 dark:text-white text-base font-medium focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Rules;
