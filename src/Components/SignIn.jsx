import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Home'; 

const SignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    pwd: '',
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    const errors = {};
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }

    if (!formData.pwd.trim()) {
      errors.pwd = 'Password is required';
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    const payload = {
      email: formData.email,
      pwd: formData.pwd,
    };

    try {
      const response = await axios.post('https://doctorappbackend20250804110728-edaah8asafcaerbc.eastasia-01.azurewebsites.net/api/Authentication/SignIn', payload);
      console.log(response.data);
      setMessage(response.data.msg || 'Login successful!');

      if (response.data.isLogin) {
        localStorage.setItem('IsLoggedIn', 'true');
        localStorage.setItem('email', formData.email);
        window.dispatchEvent(new Event('login'));
        navigate('/userprofile', { replace: true }); 
      }
    } catch (error) {
      console.log(error);
      setMessage(error.response?.data?.msg || 'Login failed');
    }
  };

  return (
    <div className="formGroup">
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}

        <input
          type="password"
          name="pwd"
          placeholder="Password"
          value={formData.pwd}
          onChange={handleChange}
        />
        {errors.pwd && <p style={{ color: 'red' }}>{errors.pwd}</p>}

        <button type="submit">Login</button>
      </form>
      {message && <p style={{ color: message.includes('success') ? 'green' : 'red' }}>{message}</p>}
      <div className="redirect">
        <p>New User?&nbsp;<a href="/signup">SignUp</a></p>
      </div>
    </div>
  );
};

export default SignIn;
