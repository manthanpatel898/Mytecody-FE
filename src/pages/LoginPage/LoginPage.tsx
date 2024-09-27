import React, { useState } from 'react';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import { useNavigate } from 'react-router-dom'; // For navigation
import './LoginPage.scss';
import '../common.scss';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleForgotPasswordClick = () => {
    navigate('/forgot-password');
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Sign In');
  };

  return (
    <div className="main-container">
      <div className="form-box">
        <h1>Welcome to Myte Cody</h1>
        <p>Your Business Analyst, Planner and Estimator</p>
        <ul className="benefits">
          <li>🚀 Streamline your Estimating Process with our Human-In-The-Loop AI System.</li>
          <li>🧠 From Idea to Personalized Proposal and Detailed Project Breakdown report in less than 1 hour.</li>
        </ul>
        <form onSubmit={handleSignIn}>
          <Input
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
          />
          <Input
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />
          <div className="forgot-password-link" onClick={handleForgotPasswordClick}>
            Forgot Password?
          </div>
          <Button type="submit">Sign In</Button>
        </form>
        <div className="signup">
          <p className="redirect">
            Don’t have an account? <span onClick={() => navigate('/register')}>Sign Up</span>
          </p>
        </div>
        <div className="separator">
          <span>Or continue with</span>
        </div>
        <Button type="button" className="google-signin-btn">
          <img src="/path/to/google-icon.png" alt="Google Logo" /> Sign in with Google
        </Button>
      </div>
    </div>
  );
};

export default LoginPage;
