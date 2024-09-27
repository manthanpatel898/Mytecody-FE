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
    <div className="main-container">
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
    </div>
  );
};

export default ForgotPasswordPage;
