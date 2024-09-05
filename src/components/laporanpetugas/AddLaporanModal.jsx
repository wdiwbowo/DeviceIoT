import React, { useState } from "react";
import reportService from '../../services/apiservice';
import { v4 as uuidv4 } from 'uuid';

const AddLaporanModal = ({ closeModal }) => {
    const [reportContent, setReportContent] = useState("");
    const [file, setFile] = useState(null);
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [type] = useState("Officer");
    const [companyGuid] = useState("COMPANY-9a01d431-dfe6-48c2-ae5a-6d0177fd2e19-2024");
    const [reporterName] = useState("TNWK");
    const [reporterGuid] = useState("USER-ce78b8f0-9b65-408b-9be5-bf94ec7ce068-2024");
    const [guid] = useState(() => uuidv4());
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLatitude(position.coords.latitude);
                    setLongitude(position.coords.longitude);
                },
                (error) => {
                    setMessage("Unable to retrieve your location.");
                }
            );
        } else {
            setMessage("Geolocation is not supported by this browser.");
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!file) {
            setMessage("File is required.");
            return;
        }

        setLoading(true);
        setMessage("");

        const formData = new FormData();
        formData.append("reportContent", reportContent);
        formData.append("file", file);
        formData.append("latitude", latitude);
        formData.append("longitude", longitude);
        formData.append("type", type);
        formData.append("companyGuid", companyGuid);
        formData.append("reporterName", reporterName);
        formData.append("reporterGuid", reporterGuid);
        formData.append("guid", guid);

        try {
            const token = localStorage.getItem('appToken');
            const response = await reportService.addReport(formData, token);
            setMessage(response.message || "Report successfully added");
            closeModal(); // Close modal on success
        } catch (err) {
            setMessage(err.message || "Failed to add report");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-md shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Add Laporan Petugas</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Report Content</label>
                        <textarea
                            value={reportContent}
                            onChange={(e) => setReportContent(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">File</label>
                        <input
                            type="file"
                            onChange={handleFileChange}
                            className="w-full px-3 py-2 border rounded-md"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Latitude</label>
                        <input
                            type="text"
                            value={latitude}
                            onChange={(e) => setLatitude(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Longitude</label>
                        <input
                            type="text"
                            value={longitude}
                            onChange={(e) => setLongitude(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md"
                            required
                        />
                        <button
                            type="button"
                            onClick={getCurrentLocation}
                            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md"
                        >
                            Get Current Location
                        </button>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Type</label>
                        <input
                            type="text"
                            value={type}
                            readOnly
                            className="w-full px-3 py-2 border rounded-md bg-gray-100"
                        />
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md"
                        >
                            {loading ? "Saving..." : "Save"}
                        </button>
                    </div>
                </form>
                {message && <p className="mt-4 text-sm text-red-500">{message}</p>}
            </div>
        </div>
    );
};

export default AddLaporanModal;
