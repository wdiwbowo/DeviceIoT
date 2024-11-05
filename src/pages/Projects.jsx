import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import apiService from "../services/apiservice";
import AddProjectModal from "../components/projects/AddProjectModal";
import EditProjectModal from "../components/projects/EditProjectModal";
import DeleteProjectModal from "../components/projects/DeleteProjectModal";
import { FaPlus, FaEdit, FaTrash, FaCopy } from 'react-icons/fa';

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
  const [isLoading, setIsLoading] = useState(false); 
  const itemsPerPage = 5;

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.getAllProjects();
      if (Array.isArray(response.data)) {
        setProjects(response.data);
        setFilteredProjects(response.data);
      } else {
        console.error("Data fetched is not an array:", response);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      setError("Failed to fetch projects.");
    } finally {
      setIsLoading(false);
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
      fetchProjects();
    } catch (error) {
      console.error("Failed to update project:", error);
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
      fetchProjects();
  
      if (filteredProjects.length % itemsPerPage === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      }
    } catch (error) {
      console.error("Failed to delete project:", error);
      setError("Failed to delete project. Please try again.");
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
      })
      .catch(err => {
        console.error("Failed to copy: ", err);
        setError("Failed to copy GUID.");
      });
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
                    <td className="px-6 py-4 whitespace-nowrap flex items-center">
                      {project.guid}
                      <button
                        onClick={() => copyToClipboard(project.guid)}
                        className="ml-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-400"
                      >
                        <FaCopy />
                      </button>
                    </td>
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
              <div className="text-center py-4">
                <p className="text-gray-500 dark:text-gray-400">No projects found.</p>
              </div>
            )}
          </div>
        )}
        {successMessage && (
          <div className="mt-4 text-green-600">{successMessage}</div>
        )}
        {error && (
          <div className="mt-4 text-red-600">{error}</div>
        )}
        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-white px-4 py-2 rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-gray-700 dark:text-white">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-white px-4 py-2 rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Modals for adding, editing, and deleting projects */}
      {showAddModal && <AddProjectModal onClose={() => setShowAddModal(false)} onAdd={handleAddProject} />}
      {showEditModal && projectToEdit && <EditProjectModal project={projectToEdit} onClose={() => setShowEditModal(false)} onEdit={handleEditProject} />}
      {showDeleteModal && projectToDelete && <DeleteProjectModal project={projectToDelete} onClose={() => setShowDeleteModal(false)} onDelete={handleDeleteProject} />}
    </div>
  );
};

export default Projects;
