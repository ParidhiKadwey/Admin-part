import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Hardcoded credentials
  const ADMIN_CREDENTIALS = {
    email: 'admin@gmail.com',
    password: 'Admin@123'
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate loading delay
    setTimeout(() => {
      if (credentials.email === ADMIN_CREDENTIALS.email && 
          credentials.password === ADMIN_CREDENTIALS.password) {
        // Store mock admin data
        sessionStorage.setItem('usertoken', 'mock-admin-token');
        sessionStorage.setItem('user', JSON.stringify({
          name: 'Admin',
          email: 'admin@gmail.com',
          role: 'admin'
        }));
        navigate('/Dashboard');
      } else {
        setError('Invalid credentials. You are not the admin.');
      }
      setLoading(false);
    }, 1000); // 1 second delay to simulate processing
  };

  // const confirmNavigation = (shouldNavigate) => {
  //   setShowConfirmation(false);
  //   if (shouldNavigate) {
  //     navigate('/'); // Navigate to home or previous page
  //   }
  // };
  return (
    <div className="login-page">
      <button className="back-button" onClick={() => navigate('/')}>{'<< Back to Home'}</button>
      <div className="login-container">
        <div className="login-form">
          <h1>Login</h1>
          <p>MP Trade Admin Panel</p>
          
          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <label>Email ID</label>
            <div className="input-group">
              <input 
                type="text" 
                name="email"
                placeholder="Email" 
                value={credentials.email}
                onChange={handleChange}
                required
              />
              <span className="icon"><FaUser /></span>
            </div>

            <label>Password</label>
            <div className="input-group">
              <input 
                type={showPassword ? "text" : "password"} 
                name="password"
                placeholder="Password" 
                value={credentials.password}
                onChange={handleChange}
                required
              />
              <span 
                className="icon" 
                onClick={() => setShowPassword(!showPassword)}
                style={{cursor: 'pointer'}}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <button 
              className="login-button" 
              type="submit"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>

        <div className="login-image">
          <img src="./login_2.jpg" alt="Login Visual" />
          <p className="copyright">Copyright © 2018 All rights reserved</p>
        </div>
      </div>
    </div>
  );
};

export default Login;