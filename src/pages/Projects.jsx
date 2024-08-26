import React, { useState, useEffect, useCallback } from "react";
import Navbar from "../components/Navbar";
import apiService from "../services/apiservice";
import debounce from "lodash.debounce";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({
    name: "",
    icon: "" // Remove this field if not needed
  });
  const [formError, setFormError] = useState("");
  const [editingProject, setEditingProject] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProjects, setFilteredProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await apiService.getAllProjects();
        if (Array.isArray(response.data)) {
          setProjects(response.data);
          setFilteredProjects(response.data); // Initialize filteredProjects
        } else {
          console.error("Data fetched is not an array:", response.data);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        setError("Failed to fetch projects. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Debounced search function
  const handleSearch = useCallback(
    debounce((term) => {
      const lowercasedTerm = term.toLowerCase();
      const results = projects.filter((project) =>
        project.name.toLowerCase().includes(lowercasedTerm) ||
        project.guid.toLowerCase().includes(lowercasedTerm)
      );
      setFilteredProjects(results);
      setCurrentPage(1); // Reset to first page on new search
    }, 300), // Adjust debounce delay as needed
    [projects]
  );

  // Update search term and trigger debounced search
  useEffect(() => {
    handleSearch(searchTerm);
  }, [searchTerm, handleSearch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProject(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleAddProject = async () => {
    if (newProject.name === "") {
      setFormError("Name is required.");
      return;
    }

    setFormError("");
    setLoading(true);

    try {
      const response = await apiService.addProject(newProject);
      setProjects([...projects, response]); // Assuming response contains the full project object
      setFilteredProjects([...filteredProjects, response]); // Update filteredProjects
      setNewProject({ name: "" }); // Remove icon from state
      setShowModal(false);
      setSuccessMessage("Project added successfully, please reload!");
    } catch (error) {
      setFormError("Failed to add project. Please try again.");
      console.error('Failed to add project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setShowModal(true); // Or use a different modal or form for editing
  };

  const handleDelete = async (guid) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      setLoading(true);

      try {
        await apiService.deleteProject(guid); // Ensure you have this API method
        setProjects(projects.filter(project => project.guid !== guid));
        setFilteredProjects(filteredProjects.filter(project => project.guid !== guid)); // Update filteredProjects
        setSuccessMessage("Project deleted successfully!");
      } catch (error) {
        console.error('Failed to delete project:', error);
        setError("Failed to delete project. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const indexOfLastProject = currentPage * itemsPerPage;
  const indexOfFirstProject = indexOfLastProject - itemsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
      <Navbar />
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Projects</h1>
          <button
            className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            onClick={() => setShowModal(true)}
          >
            Add Project
          </button>
        </div>

        <div className="mb-4">
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">GUID</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {currentProjects.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-center text-gray-500 dark:text-gray-300">
                        No projects found
                      </td>
                    </tr>
                  ) : (
                    currentProjects.map((project, index) => (
                      <tr key={project.guid || index} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {indexOfFirstProject + index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{project.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{project.guid}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                          <button
                            onClick={() => handleEdit(project)}
                            className="text-blue-500 dark:text-blue-400 hover:underline mr-2"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(project.guid)}
                            className="text-red-500 dark:text-red-400 hover:underline"
                          >
                            Delete
                          </button>
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

            {/* Add/Edit Project Modal */}
            {showModal && (
              <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-lg">
                  <h2 className="text-2xl font-bold mb-4">{editingProject ? "Edit Project" : "Add Project"}</h2>
                  {formError && <p className="text-red-500 mb-4">{formError}</p>}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={newProject.name}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                    />
                  </div>
                  {/* Removed Icon Field */}
                  <div className="flex justify-end">
                    <button
                      onClick={handleAddProject}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                    >
                      {editingProject ? "Update Project" : "Add Project"}
                    </button>
                    <button
                      onClick={() => setShowModal(false)}
                      className="ml-4 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg shadow-md hover:bg-gray-400 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                    >
                      Cancel
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

export default Projects;
