import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { FaPlus } from 'react-icons/fa';
import apiService from "../services/apiservice"; // Adjust the import based on your file structure
import Swal from 'sweetalert2';

const ProjectsTable = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);

  const itemsPerPage = 10; // Define how many items per page
  const queryParams = {
    companyGuid: 'COMPANY-9a01d431-dfe6-48c2-ae5a-6d0177fd2e19-2024',
    type: 'AIProcessing',
  };

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await apiService.getAllReportsByCompany(queryParams);

        // Akses struktur data yang benar
        const reportsData = response.data.data || [];
        setReports(reportsData);

        // Show SweetAlert based on the data length
        if (reportsData.length === 0) {
          // Handle empty data case
        } else {
          // Handle data found case
        }
      } catch (err) {
        // Ganti dengan notifikasi SweetAlert
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error fetching reports',
          confirmButtonText: 'Ok'
        });
        setError('Error fetching reports');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = reports.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(reports.length / itemsPerPage);

  if (error) return <p>{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Laporan</h1>
          <button
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            <FaPlus className="mr-2" /> Add Laporan
          </button>
        </div>
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
              {currentItems.length > 0 ? currentItems.map((item, index) => (
                <tr key={item._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.reporterName || 'Unknown'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.reportContent || 'No Content'}</td>
                  {/* Display image */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={`Report Image ${index + 1}`}
                        className="h-16 w-16 object-cover rounded"
                      />
                    ) : (
                      'N/A'
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="text-center py-8 text-gray-600 dark:text-gray-300">No reports found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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
    </div>
  );
};

export default ProjectsTable;
