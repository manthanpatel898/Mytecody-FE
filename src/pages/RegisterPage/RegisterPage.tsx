import React, { useState } from 'react';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './RegisterPage.scss';

const RegisterPage: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const toggleShowPassword = () => setShowPassword(!showPassword);
  const toggleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Registration logic here
    if (password === confirmPassword) {
      console.log('Registered successfully');
    } else {
      console.log('Passwords do not match');
    }
  };

  return (
    <div className="main-container">
      <div className="form-box">
        <h1>Welcome to Myte Cody</h1>
        <p>Your Business Analyst, Planner and Estimator</p>
        <p>🚀 Streamline your Estimating Process with our Human-In-The-Loop AI System.</p>
        <p>🧠 From Idea to Personalized Proposal and Detailed Project Breakdown report in less than 1 hour. Streamline your Digital Transformation or Custom Tech Service Offerings with Myte.</p>
        <h2>Register to continue</h2>

        <form onSubmit={handleRegister}>
          <Input
            label="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            type="text"
          />
          <Input
            label="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            type="text"
          />
          <Input
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
          />
          <div className="password-container">
            <Input
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? 'text' : 'password'}
            />
            <span className="toggle-password" onClick={toggleShowPassword}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <div className="password-container">
            <Input
              label="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type={showConfirmPassword ? 'text' : 'password'}
            />
            <span className="toggle-password" onClick={toggleShowConfirmPassword}>
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <Button type="submit">Register</Button>
        </form>

        <p className="redirect">
          Already have an account? <span onClick={() => navigate('/login')}>Log In</span>
        </p>

        <div className="divider">
          <span>Or continue with</span>
        </div>

        <Button type="button">
          <img src="/google-icon.png" alt="Google" />
          Sign Up with Google
        </Button>
      </div>
    </div>
  );
};

export default RegisterPage;
