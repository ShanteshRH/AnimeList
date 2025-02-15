import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import './Login.css';
import axios from 'axios';

const Login = () => {
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [error,setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login',{
                email,
                password
            });
            
            const { token, username, profilePicture } = response.data;
            console.log(username);
            localStorage.setItem("token",token);
            localStorage.setItem("username",username);
            localStorage.setItem("profilePicture",profilePicture);
            localStorage.setItem("mode",'light');

            navigate("/home");
            setSuccessMessage('Login successful! Redirecting...');
        } catch (error) {
            setError(error.response?.data?.message || "Something went wrong.Pleas try again");
        }
    }
    
    return (
        <div className="login-container">
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <div>
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                </div>
                <div>
                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                </div>
                {error && <p className="error">{error}</p>}
                {successMessage && <p className="success">{successMessage}</p>}
                <button type="submit">Login</button>
            </form>
            <p>
                <button onClick={() => navigate("/signup")} >Sign Up</button>
            </p>
        </div>
    )
}

export default Login
