import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { FaPlus } from "react-icons/fa";
import AddLaporanModal from "../components/laporanpetugas/AddLaporanModal";
import apiService from "../services/apiservice";

const ProjectsTable = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [reportsPerPage] = useState(5);
  const [successMessage, setSuccessMessage] = useState(""); // State for success message

  const queryParams = {
    companyGuid: "COMPANY-9a01d431-dfe6-48c2-ae5a-6d0177fd2e19-2024",
    type: "Officer",
  };

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await apiService.getAllReportsByCompany(queryParams);
        const reportsData = response.data.data || [];
        setReports(reportsData);
      } catch (err) {
        setError("Error fetching reports");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handleAddReport = (newReport) => {
    setReports((prevReports) => [newReport, ...prevReports]);
    setSuccessMessage("Laporan berhasil ditambahkan!"); // Set success message
    setTimeout(() => {
      setSuccessMessage(""); // Clear success message after 2 seconds
    }, 2000);
  };

  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = reports.slice(indexOfFirstReport, indexOfLastReport);

  const totalPages = Math.ceil(reports.length / reportsPerPage);

  const nextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Laporan</h1>
          <button
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            onClick={() => setIsModalOpen(true)}
          >
            <FaPlus className="mr-2" /> Add Laporan
          </button>
        </div>
        {successMessage && (
          <div className="mb-4 p-4 bg-green-100 text-green-800 rounded-md dark:bg-green-800 dark:text-green-200">
            {successMessage}
          </div>
        )}
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">#</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Reporter Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Report Content</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Img</th>
              </tr>
            </thead>
            <tbody>
              {currentReports.length > 0 ? (
                currentReports.map((item, index) => (
                  <tr key={item._id}>
                    <td className="px-6 py-4 whitespace-nowrap">{indexOfFirstReport + index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.reporterName || "Unknown"}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.reportContent || "No Content"}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={`Report Image ${index + 1}`}
                          className="h-16 w-16 object-cover rounded"
                        />
                      ) : (
                        <span>No Image Available</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-8 text-gray-600 dark:text-gray-300">
                    No reports found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between mt-4">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-md ${currentPage === 1 ? 'bg-gray-300 dark:bg-gray-600' : 'bg-blue-600 text-white dark:bg-blue-500'}`}
          >
            Previous
          </button>
          <span className="text-gray-700 dark:text-gray-300">Page {currentPage} of {totalPages}</span>
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-md ${currentPage === totalPages ? 'bg-gray-300 dark:bg-gray-600' : 'bg-blue-600 text-white dark:bg-blue-500'}`}
          >
            Next
          </button>
        </div>
      </div>
      {isModalOpen && <AddLaporanModal closeModal={() => setIsModalOpen(false)} onAddReport={handleAddReport} />} {/* Pass handleAddReport to modal */}
    </div>
  );
};

export default ProjectsTable;
