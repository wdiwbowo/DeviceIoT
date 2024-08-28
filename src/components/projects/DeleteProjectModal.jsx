import React from "react";
import PropTypes from "prop-types";

const DeleteProjectModal = ({ show, onClose, onDelete, project }) => {
  if (!show) return null;


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">Delete Project</h2>
        <p className="mb-4">
          Are you sure you want to delete the project <strong>{project}</strong>?
        </p>
        <div className="flex justify-end">
          <button
            onClick={onDelete}
            className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
          >
            Delete
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

// Adding PropTypes for property validation
DeleteProjectModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  project: PropTypes.shape({
    name: PropTypes.string,
    guid: PropTypes.string
  })
};

export default DeleteProjectModal;
