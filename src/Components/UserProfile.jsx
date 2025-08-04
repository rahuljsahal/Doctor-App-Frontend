import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UserProfile.css';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ newEmail: '', newPhoneNo: '' });
  const email = localStorage.getItem('email'); // Current Email

  useEffect(() => {
    if (!email) return;

    const fetchUser = async () => {
      try {
        const res = await axios.get(`https://doctorappbackend20250804110728-edaah8asafcaerbc.eastasia-01.azurewebsites.net/api/Profile/GetUserDetails?email=${email}`);
        setUser(res.data);
        setFormData({ newEmail: res.data.email, newPhoneNo: res.data.phno }); // prefill
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
  }, [email]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put('https://doctorappbackend20250804110728-edaah8asafcaerbc.eastasia-01.azurewebsites.net/api/Profile/updateProfile', {
        currentEmail: email,
        newEmail: formData.newEmail,
        newPhoneNo: formData.newPhoneNo
      });

      alert(response.data.msg);
      localStorage.setItem('email', formData.newEmail); // Update localStorage email
      setEditMode(false);

      // Refresh user data
      setUser(prev => ({
        ...prev,
        email: formData.newEmail,
        phno: formData.newPhoneNo
      }));
    } catch (error) {
      console.error("Update failed", error);
      alert("Update failed");
    }
  };

  if (!user) {
    return (
      <div className="profile-container">
        <h2>User not logged in</h2>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      <div className="profile-card">
        <p><strong>Name:</strong> {user.patientName}</p>
        <p>
          <strong>Email:</strong>{' '}
          {editMode ? (
            <input
              type="email"
              name="newEmail"
              value={formData.newEmail}
              onChange={handleChange}
            />
          ) : (
            user.email
          )}
        </p>
        <p>
          <strong>Phone No:</strong>{' '}
          {editMode ? (
            <input
              type="text"
              name="newPhoneNo"
              value={formData.newPhoneNo}
              onChange={handleChange}
            />
          ) : (
            user.phno
          )}
        </p>
        <p><strong>DOB:</strong> {user.dob?.split('T')[0]}</p>

        {editMode ? (
          <>
            <button onClick={handleUpdate}>Save</button>
            <button onClick={() => setEditMode(false)}>Cancel</button>
          </>
        ) : (
          <button onClick={() => setEditMode(true)}>Edit Contact</button>
        )}
      </div>
    </div>
  );
};

export default UserProfile;