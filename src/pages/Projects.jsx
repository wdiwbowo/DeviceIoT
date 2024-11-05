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
    if (!updatedProject || !updatedProject.name) {
      setError("Name is required.");
      return;
    }
    
    try {
      await apiService.updateProject(updatedProject.guid, updatedProject);
      setShowEditModal(false);
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
      fetchProjects();
      if (filteredProjects.length % itemsPerPage === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      }
    } catch (error) {
      console.error("Failed to delete project:", error);
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
            <FaPlus className="mr-2" /> Add Project
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Icon</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                {currentItems.length > 0 ? (
                  currentItems.map((project) => (
                    <tr key={project.guid}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{project.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <img src={project.icon} alt={project.name} className="w-8 h-8" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => {
                            setProjectToEdit(project);
                            setShowEditModal(true);
                          }}
                          className="text-yellow-500 hover:text-yellow-600"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => {
                            setProjectToDelete(project);
                            setShowDeleteModal(true);
                          }}
                          className="text-red-500 hover:text-red-600 ml-4"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                      No projects found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        <div className="flex justify-between items-center mt-4">
          <div>
            <span className="text-gray-700 dark:text-gray-300">Page {currentPage} of {totalPages}</span>
          </div>
          <div>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-4 py-2 mx-1 rounded-md ${currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-700'}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
        {error && <div className="text-red-500 mt-4">{error}</div>}
        {successMessage && <div className="text-green-500 mt-4">{successMessage}</div>}
      </div>
      <AddProjectModal show={showAddModal} onClose={() => setShowAddModal(false)} onAdd={handleAddProject} />
      <EditProjectModal show={showEditModal} onClose={() => setShowEditModal(false)} project={projectToEdit} onUpdate={handleEditProject} />
      <DeleteProjectModal show={showDeleteModal} onClose={() => setShowDeleteModal(false)} project={projectToDelete} onDelete={handleDeleteProject} />
    </div>
  );
};

export default Projects;
