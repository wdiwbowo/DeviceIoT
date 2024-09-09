import React, { useState } from 'react';
import apiService from '../../services/apiservice';
import { v4 as uuidv4 } from 'uuid';

const AddUserModal = ({ isOpen, onClose, onAddUser }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [code, setCode] = useState('0');

    const [errors, setErrors] = useState({});

    const handleAddUser = async () => {
        const data = await apiService.decodeTokenApp()
        const newUser = {
            guid: uuidv4(),
            email,
            password,
            phoneNumber,
            name,
            role,
            code,
            companyGuid : data.companyGuid,
            guidAplication: "PROJECT-519391a1-bff6-4e8c-a854-bed3984cc0bb-2024",
        };
        // console.log(newUser)
    
        try {
            const response = await apiService.addUser(newUser);
            if (response.success) {
                onAddUser(response);
                // console.log(response)
                onClose();
            } else {
                console.error('Failed to add user:', response.message);
                setErrors({ general: response.message });
            }
        } catch (error) {
            console.error('Error adding user:', error);
            setErrors({ general: 'Error adding user.' });
        }
    
        // Reset form fields and errors
        setEmail('');
        setPassword('');
        setPhoneNumber('');
        setName('');
        setRole('');
        setCode('0');
        setErrors({});
    };    

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-4xl w-full">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Add User</h2>
                {errors.general && (
                    <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
                        <p>{errors.general}</p>
                    </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                        <input
                            type="email"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                        <input
                            type="password"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
                        <input
                            type="text"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                        <input
                            type="text"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
                        <select
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="">Select Role</option>
                            <option value="Warga">Warga</option>
                            <option value="User">User</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Code</label>
                        <input
                            type="text"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onClose}
                        className="bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-gray-100 px-4 py-2 rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleAddUser}
                        className="bg-blue-500 dark:bg-blue-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Add User
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddUserModal;