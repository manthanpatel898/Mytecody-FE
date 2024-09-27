import React, { useState } from 'react';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './ResetPasswordPage.scss';
import '../common.scss';

const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === confirmPassword) {
      console.log('Password has been reset');
      // Handle the password reset logic here (e.g., API call)
    } else {
      console.log('Passwords do not match');
    }
  };

  const handleBackClick = () => {
    navigate('/forgot-password');
  };

  return (
    <div className="main-container">
      <div className="form-box">
        <div className="back-button" onClick={handleBackClick}>
          <FaArrowLeft /> Back to Forgot Password
        </div>
        <h1>Reset your password</h1>
        <p>Enter your new password below and confirm it to reset your password.</p>
        <form onSubmit={handleResetPassword}>
          <Input
            label="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />
          <Input
            label="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            type="password"
          />
          <Button type="submit">Reset Password</Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
