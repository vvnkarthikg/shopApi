import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = ({ onSwitchToSignup }) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/user/signin`, {
        email,
        password,
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('isAdmin', response.data.isAdmin);

      navigate('/');
    } catch (err) {
      console.log('Login failed:', err);
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        {/* Background image goes here */}
      </div>
      <div className="auth-right">
        <form onSubmit={handleSubmit} className="auth-form">
          <h2>Login</h2>
          {error && <div className="auth-error-message">{error}</div>}
          <div className="auth-form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="auth-form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="auth-submit-btn">Login</button>
          <p className="auth-switch-text">
            Don't have an account? 
            <button type="button" onClick={onSwitchToSignup} className="auth-switch-btn">Signup</button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
