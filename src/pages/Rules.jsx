import React, { useState, useEffect, useCallback } from "react";
import Navbar from "../components/Navbar";
import apiService from "../services/apiservice";
import debounce from "lodash.debounce";
import AddModal from "../components/Rules/AddModal";
import EditModal from "../components/Rules/EditModal";
import DeleteModal from "../components/Rules/DeleteModal";

const Rules = () => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedRule, setSelectedRule] = useState(null);
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
            setData((prevData) => [...prevData, newRule]);
            setFilteredData((prevData) => [...prevData, newRule]);
            setSuccessMessage("Rule added successfully!");
            setShowAddModal(false);
        } catch (error) {
            setErrorMessage(error.message || "Failed to add rule.");
            console.error('Failed to add rule:', error);
        } finally {
            setLoading(false);
        }
    };

    // Handle edit rule
   // Handle edit rule
const handleEdit = async () => {
    if (!selectedRule) return;

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
        // Kirim request untuk memperbarui aturan
        const response = await apiService.updateRule(selectedRule.guid, guidInput, valueInput, guidOutput, valueOutput);
        console.log('Rule updated successfully:', response);

        // Perbarui data di state
        const updatedData = data.map((rule) =>
            rule.guid === selectedRule.guid
                ? { ...rule, guidInput, valueInput, guidOutput, valueOutput }
                : rule
        );

        setData(updatedData);
        setFilteredData(updatedData);
        setSuccessMessage("Rule updated successfully!");
        setShowEditModal(false);
    } catch (error) {
        setErrorMessage(error.message || "Failed to update rule.");
        console.error('Failed to update rule:', error);
    } finally {
        setLoading(false);
    }
};

    // Handle delete rule
    const handleDelete = async () => {
        if (!selectedRule) return;
        setLoading(true);
        setErrorMessage("");
        setSuccessMessage("");
        try {
            const response = await apiService.deleteRule(selectedRule.guid);
            console.log('Rule deleted successfully:', response);
            const updatedData = data.filter((rule) => rule.guid !== selectedRule.guid);
            setData(updatedData);
            setFilteredData(updatedData);
            setSuccessMessage("Rule deleted successfully!");
            setShowDeleteModal(false);
        } catch (error) {
            setErrorMessage(error.message || "Failed to delete rule.");
            console.error('Failed to delete rule:', error);
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
                        onClick={() => {
                            setGuidInput("");
                            setValueInput("");
                            setGuidOutput("");
                            setValueOutput("");
                            setShowAddModal(true);
                        }}
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
                                            <button
                                                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mr-4"
                                                onClick={() => {
                                                    setSelectedRule(item);
                                                    setGuidInput(item.guidInput);
                                                    setValueInput(item.valueInput);
                                                    setGuidOutput(item.guidOutput);
                                                    setValueOutput(item.valueOutput);
                                                    setShowEditModal(true);
                                                }}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                                                onClick={() => {
                                                    setSelectedRule(item);
                                                    setShowDeleteModal(true);
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        <div className="mt-4 flex justify-between">
                            <button
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(currentPage - 1)}
                            >
                                Previous
                            </button>
                            <span className="self-center text-gray-700 dark:text-gray-300">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(currentPage + 1)}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}

                {/* Add Modal */}
                <AddModal
                    isOpen={showAddModal}
                    onClose={() => setShowAddModal(false)}
                    onSave={() => handleSave()}
                    guidInput={guidInput}
                    setGuidInput={setGuidInput}
                    valueInput={valueInput}
                    setValueInput={setValueInput}
                    guidOutput={guidOutput}
                    setGuidOutput={setGuidOutput}
                    valueOutput={valueOutput}
                    setValueOutput={setValueOutput}
                />

                {/* Edit Modal */}
                <EditModal
                    isOpen={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    onSave={() => handleEdit()}
                    guidInput={guidInput}
                    setGuidInput={setGuidInput}
                    valueInput={valueInput}
                    setValueInput={setValueInput}
                    guidOutput={guidOutput}
                    setGuidOutput={setGuidOutput}
                    valueOutput={valueOutput}
                    setValueOutput={setValueOutput}
                />

                {/* Delete Modal */}
                <DeleteModal
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onDelete={() => handleDelete()}
                />
            </div>
        </div>
    );
};

export default Rules;
