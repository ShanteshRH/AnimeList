import axios from 'axios';
import React, { useState } from 'react'
import './Signup.css';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [formData, setFormData] = useState({
        username:'',
        email:'',
        password:''
    });
    const [error, setError] = useState("");  // Error state
    const [success, setSuccess] = useState("");  // Success message state
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name] : e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");  // Clear previous error
        setSuccess("");  // Clear previous success message
    
        // Validation
        if (!formData.username || !formData.email || !formData.password) {
          setError("All fields are required.");
          return;
        }
    
        try {
          const response = await axios.post(
            "http://localhost:5000/api/auth/signup",
            formData
          );
          setSuccess(response.data.message); 
          navigate("/");
        } catch (error) {
          // Check for server-side error messages and show accordingly
          if (error.response && error.response.data) {
            setError(error.response.data.error || "Something went wrong.");
          } else {
            setError("An error occurred, please try again later.");
          }
        }
    };

    return (
        <div className="signup-container">
        <h1>Signup</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}
          <button type="submit">Sign Up</button>
        </form>
      </div>
    )
}

export default Signup;
