// src/components/company/AddCompanyModal.jsx
import React, { useState } from 'react';

const AddCompanyModal = ({ showModal, onClose, onSave }) => {
  const [companyData, setCompanyData] = useState({
    name: '',
    type: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompanyData({
      ...companyData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(companyData);
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Add Company</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="name">Company Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={companyData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="type">Company type</label>
            <input
              type="text"
              id="type"
              name="type"
              value={companyData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCompanyModal;
