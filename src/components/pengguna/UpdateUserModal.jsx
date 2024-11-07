import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

function UpdateUserModal({ isOpen, onClose, onUpdateUser, user }) {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
  });

  useEffect(() => {
    if (user) {
      setUserData({
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    onUpdateUser(user.guid, userData);
  };

  return (
    isOpen && (
      <div className="modal">
        <div className="modal-content">
          <h2>Update User</h2>
          <input
            type="text"
            name="name"
            value={userData.name}
            onChange={handleChange}
            placeholder="Name"
          />
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            placeholder="Email"
          />
          <input
            type="text"
            name="phoneNumber"
            value={userData.phoneNumber}
            onChange={handleChange}
            placeholder="Phone Number"
          />
          <button onClick={handleSubmit}>Update</button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    )
  );
}

export default UpdateUserModal;
