import React, { useState, useEffect } from 'react';

const EditProjectModal = ({ show, onClose, project, onUpdate }) => {
  const [updatedProject, setUpdatedProject] = useState({ ...project });
  const [formError, setFormError] = useState("");

  // Ini memastikan updatedProject akan diperbarui setiap kali project berubah
  useEffect(() => {
    if (project) {
      setUpdatedProject({ ...project });
    }
  }, [project]);

  const handleUpdateProject = async () => {
    if (!updatedProject.name) {
      setFormError("Name is required.");
      return;
    }

    try {
      await onUpdate(updatedProject);
      onClose(); // Tutup modal jika pembaruan berhasil
    } catch (error) {
      setFormError("Failed to update project. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProject((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setFormError(""); // Reset error saat ada perubahan input
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">Edit Project</h2>
        {formError && <p className="text-red-500 mb-4">{formError}</p>}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
          <input
            type="text"
            name="name"
            value={updatedProject.name || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm dark:bg-gray-900 dark:border-gray-700 dark:text-white"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Icon URL</label>
          <input
            type="text"
            name="icon"
            value={updatedProject.icon || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm dark:bg-gray-900 dark:border-gray-700 dark:text-white"
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleUpdateProject}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Update Project
          </button>
          <button
            onClick={onClose}
            className="ml-4 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg shadow-md hover:bg-gray-400 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProjectModal;
