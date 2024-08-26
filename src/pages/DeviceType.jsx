import React, { useEffect, useState } from "react";
import apiService from "../services/apiservice";
import Navbar from "../components/Navbar";
import debounce from "lodash.debounce";

const DeviceTypes = () => {
    const [deviceTypes, setDeviceTypes] = useState([]);
    const [filteredDeviceTypes, setFilteredDeviceTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [showModal, setShowModal] = useState(false);
    const [newDeviceType, setNewDeviceType] = useState({
        name: "",
        active: true,
    });
    const [formError, setFormError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchDeviceTypes = async () => {
            try {
                const response = await apiService.getDeviceTypes();
                if (Array.isArray(response.data)) {
                    setDeviceTypes(response.data);
                    setFilteredDeviceTypes(response.data);
                } else {
                    console.error("Unexpected data format:", response.data);
                    setError("Unexpected data format. Please try again.");
                }
            } catch (error) {
                console.error("Error fetching device types:", error);
                setError("Failed to fetch device types. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchDeviceTypes();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewDeviceType((prevState) => ({
            ...prevState,
            [name]: name === "active" ? JSON.parse(value) : value,
        }));
    };

    const handleAddDeviceType = async () => {
        if (!newDeviceType.name.trim()) {
            setFormError("Name is required.");
            return;
        }

        setFormError("");
        setLoading(true);

        try {
            const response = await apiService.addDeviceType(newDeviceType);

            if (response.status === 200) {
                if (response.data && response.data.guid) {
                    setDeviceTypes((prevState) => [...prevState, response.data]);
                    setFilteredDeviceTypes((prevState) => [...prevState, response.data]);
                    setNewDeviceType({ name: "", active: true });
                    setShowModal(false);
                    setSuccessMessage("Device type added successfully!");
                } else {
                    console.error("Unexpected response data format:", response.data);
                    setFormError("Unexpected response format.");
                }
            } else {
                console.error("Unexpected response status:", response.status);
                setFormError("Unexpected response status.");
            }
        } catch (error) {
            console.error("Failed to add device type:", error);
            setFormError("Failed to add device type. Please try again.");
        } finally {
            setLoading(false);
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

    const indexOfLastDeviceType = currentPage * itemsPerPage;
    const indexOfFirstDeviceType = indexOfLastDeviceType - itemsPerPage;
    const currentDeviceTypes = filteredDeviceTypes.slice(indexOfFirstDeviceType, indexOfLastDeviceType);

    const totalPages = Math.ceil(filteredDeviceTypes.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    return (
        <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
            <Navbar />
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Device Types</h1>
                    <button
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                        onClick={() => setShowModal(true)}
                    >
                        Add Device Type
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

                {loading ? (
                    <div className="text-center text-gray-500 dark:text-gray-300">Loading...</div>
                ) : error ? (
                    <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
                        <p>{error}</p>
                    </div>
                ) : (
                    <>
                        {successMessage && (
                            <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
                                <p>{successMessage}</p>
                            </div>
                        )}
                        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-md">
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
                                    {currentDeviceTypes.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-4 text-center text-gray-500 dark:text-gray-300">
                                                No device types found
                                            </td>
                                        </tr>
                                    ) : (
                                        currentDeviceTypes.map((type, index) => (
                                            <tr key={type.guid || index} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                                    {indexOfFirstDeviceType + index + 1}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{type.name || 'N/A'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{type.active !== undefined ? (type.active ? "Yes" : "No") : 'N/A'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{type.guid || 'N/A'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-600 mr-4">Edit</button>
                                                    <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-600">Delete</button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Controls */}
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

                        {/* Add Device Type Modal */}
                        {showModal && (
                            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-lg">
                                    <h2 className="text-2xl font-bold mb-4">Add Device Type</h2>
                                    {formError && <p className="text-red-500 mb-4">{formError}</p>}
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={newDeviceType.name}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Active</label>
                                        <select
                                            name="active"
                                            value={newDeviceType.active}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                                        >
                                            <option value={true}>Yes</option>
                                            <option value={false}>No</option>
                                        </select>
                                    </div>
                                    <div className="flex justify-end">
                                        <button
                                            onClick={() => setShowModal(false)}
                                            className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 mr-2"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleAddDeviceType}
                                            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default DeviceTypes;
