import React, { useState } from 'react';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './ForgotPasswordPage.scss';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSendResetLink = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Send Reset Link');
    navigate('/reset-password'); // <-- This will navigate to the Reset Password page
  };

  const handleBackClick = () => {
    navigate('/login');
  };

  return (
    <div className="login-page">
      {/* Left Side: Login Form */}
      <div className="login-container">
      <div className="form-box">
        <div className="back-button" onClick={handleBackClick}>
          <FaArrowLeft /> Back to Login
        </div>
        <h1>Reset your password</h1>
        <p>Enter your email address below and we'll send you a link to reset your password.</p>
        <form onSubmit={handleSendResetLink}>
          <Input
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
          />
          <Button type="submit">Send Reset Link</Button>
        </form>
      
    </div>
        {/* Right Side: AI-themed Info Section */}
        <div className="info-section">

          <div className="title">Make a Proposal Using AI</div>
        <ul className="benefits">
          <p>🚀 Streamline your Estimating Process with our Human-In-The-Loop AI System.</p>
          <p>🧠 From Idea to Personalized Proposal and Detailed Project Breakdown report in less than 1 hour.</p>
        </ul>
         

          {/* Person Section */}
          <div className="person-section">
            <div className="person">
              <div className="image">
                <img src="path-to-image1.jpg" alt="Waleed Lozano" />
              </div>
              <div className="info">
                <div className="name">Waleed Lozano</div>
                <div className="title">Product Designer</div>
              </div>
            </div>

            <div className="person">
              <div className="image">
                <img src="path-to-image2.jpg" alt="Jane Doe" />
              </div>
              <div className="info">
                <div className="name">Jane Doe</div>
                <div className="title">Project Manager</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
