// src/Main.js
import React, { useState } from 'react';
import Login from './Login';
import Signup from './Signup';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  const handleSwitchToSignup = () => setIsLogin(false);
  const handleSwitchToLogin = () => setIsLogin(true);

  return (
    <div className="auth-wrapper">
      {isLogin 
        ? <Login onSwitchToSignup={handleSwitchToSignup} /> 
        : <Signup onSwitchToLogin={handleSwitchToLogin} />}
    </div>
  );
};

export default Auth;
