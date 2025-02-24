import React from 'react';
import axios from 'axios'; // Ensure axios is imported
import './Login.css';

const Signup = ({ onSwitchToLogin }) => {
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/signup`, { // Use backticks here
        firstName,
        lastName,
        email,
        password,
        isAdmin: false // Adjust as necessary
      });
      
      alert('Signup successful! You can now log in.');
    } catch (err) {
      console.error('Signup failed:', err);
      alert('Signup failed. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        {/* Background image can go here */}
      </div>
      <div className="auth-right">
        <form onSubmit={handleSubmit} className="auth-form">
          <h2>Signup</h2>
          <div className="auth-form-group">
            <label>First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="auth-form-group">
            <label>Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
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
          <div className="auth-form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              
            />
          </div>
          
          <button type="submit" className="auth-submit-btn">Signup</button>
          <p className="auth-switch-text">Already have an account? 
            <button type="button" onClick={onSwitchToLogin} className="auth-switch-btn">Login</button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
