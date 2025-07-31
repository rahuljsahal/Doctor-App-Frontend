import React, { useState } from 'react';
import axios from 'axios';
import './SignUp.css'

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dob: '',
    phoneNo: '',
    pwd: '',
    confirmPwd: ''
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const validate = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }

    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Invalid email format";
    }

    if (!formData.dob) {
      errors.dob = "Date of birth is required";
    } else if (new Date(formData.dob) > new Date()) {
      errors.dob = "DOB cannot be in the future";
    }

    if (!formData.phoneNo) {
      errors.phoneNo = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phoneNo)) {
      errors.phoneNo = "Phone number must be exactly 10 digits";
    }

    if (!formData.pwd) {
      errors.pwd = "Password is required";
    }

    if (!formData.confirmPwd) {
      errors.confirmPwd = "Confirm Password is required";
    } else if (formData.pwd !== formData.confirmPwd) {
      errors.confirmPwd = "Passwords do not match";
    }

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({}); // Clear previous errors

    const payload = {
      name: formData.name,
      email: formData.email,
      dob: formData.dob,
      phoneNo: formData.phoneNo,
      pwd: formData.pwd,
      confirmPwd: formData.confirmPwd,
      dor: new Date().toISOString()
    };

    try {
      const response = await axios.post('https://localhost:7144/api/Authentication/SignUp', payload);
      setMessage(response.data.message || 'Signup successful!');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className='formGroup'>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} />
        {errors.name && <p style={{ color: 'red' }}>{errors.name}</p>}

        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
        {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}

        <input type="date" name="dob" value={formData.dob} onChange={handleChange} />
        {errors.dob && <p style={{ color: 'red' }}>{errors.dob}</p>}

        <input type="text" name="phoneNo" placeholder="Phone Number" value={formData.phoneNo} onChange={handleChange} />
        {errors.phoneNo && <p style={{ color: 'red' }}>{errors.phoneNo}</p>}

        <input type="password" name="pwd" placeholder="Password" value={formData.pwd} onChange={handleChange} />
        {errors.pwd && <p style={{ color: 'red' }}>{errors.pwd}</p>}

        <input type="password" name="confirmPwd" placeholder="Confirm Password" value={formData.confirmPwd} onChange={handleChange} />
        {errors.confirmPwd && <p style={{ color: 'red' }}>{errors.confirmPwd}</p>}

        <button type="submit">Register</button>
      </form>
       {message && <p style={{ color: message.includes('success') ? 'green' : 'red' }}>{message}</p>}
       <div className="redirect"><p>Already Registerd?&nbsp;<a href='/signin'>Login</a></p></div>
    </div>
  );
};

export default Signup;
