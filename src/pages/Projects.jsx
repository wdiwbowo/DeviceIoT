import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import apiService from "../services/apiservice";
import AddProjectModal from "../components/projects/AddProjectModal";
import EditProjectModal from "../components/projects/EditProjectModal";
import DeleteProjectModal from "../components/projects/DeleteProjectModal";
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [projectToEdit, setProjectToEdit] = useState(null);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const itemsPerPage = 5;

  const fetchProjects = async () => {
    setIsLoading(true); // Start loading
    try {
      const response = await apiService.getAllProjects();
      if (Array.isArray(response.data)) {
        setProjects(response.data);
        setFilteredProjects(response.data);
      }
    } catch (error) {
      setError("Failed to fetch projects.");
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    const filtered = projects.filter((project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.guid.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProjects(filtered);
    setCurrentPage(1);
  }, [searchQuery, projects]);

  const handleAddProject = async (newProject) => {
    try {
      await apiService.addProject(newProject);
      setShowAddModal(false);
      setSuccessMessage("Project added successfully!");
      fetchProjects();
    } catch (error) {
      setError("Failed to add project. Please try again.");
    }
  };

  const handleEditProject = async (updatedProject) => {
    if (!updatedProject || updatedProject.name === "") {
      setError("Name is required.");
      return;
    }

    try {
      await apiService.updateProject(updatedProject.guid, updatedProject);
      setShowEditModal(false);
      setSuccessMessage("Project updated successfully!");
      fetchProjects();
    } catch (error) {
      setError("Failed to update project. Please try again.");
    }
  };

  const handleDeleteProject = async () => {
    if (!projectToDelete || !projectToDelete.guid) {
      setError("No project selected for deletion.");
      return;
    }
  
    try {
      await apiService.deleteProject(projectToDelete.guid);
      setShowDeleteModal(false);
      setSuccessMessage("Project deleted successfully!");
  
      // Refresh the project list
      fetchProjects();
  
      // Handle edge case: If deleting the last item on the page, go to the previous page
      if (filteredProjects.length % itemsPerPage === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      }
    } catch (error) {
      setError("Failed to delete project. Please try again.");
    }
  };  

  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
        setError(null);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [successMessage, error]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProjects.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Projects</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
                <FaPlus className="mr-2" />Add Project
          </button>
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        {isLoading ? (
          <div className="text-center py-8">
            <div className="spinner-border text-blue-600" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">#</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Project Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">GUID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Secret Key</th> 
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((project, index) => (
                  <tr key={project.guid}>
                    <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{project.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{project.guid}</td>
                     <td className="px-6 py-4 whitespace-nowrap">{project.secretKey}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setProjectToEdit(project);
                            setShowEditModal(true);
                          }}
                          className="flex items-center bg-blue-600 text-white px-3 py-2 rounded-md shadow-sm hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                        >
                          <FaEdit className="mr-2" /> Edit
                        </button>
                        <button
                          onClick={() => {
                            setProjectToDelete(project);
                            setShowDeleteModal(true);
                          }}
                          className="flex items-center bg-red-600 text-white px-3 py-2 rounded-md shadow-sm hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
                        >
                          <FaTrash className="mr-2" /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {currentItems.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-300">No projects found.</p>
              </div>
            )}
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
      {showAddModal && <AddProjectModal onClose={() => setShowAddModal(false)} onAddProject={handleAddProject} />}
      {showEditModal && <EditProjectModal project={projectToEdit} onClose={() => setShowEditModal(false)} onEditProject={handleEditProject} />}
      {showDeleteModal && <DeleteProjectModal project={projectToDelete} onClose={() => setShowDeleteModal(false)} onDeleteProject={handleDeleteProject} />}
      {successMessage && <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-green-500 text-white p-3 rounded">{successMessage}</div>}
      {error && <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-red-500 text-white p-3 rounded">{error}</div>}
    </div>
  );
};

export default Projects;
