import React, { useState } from 'react';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './RegisterPage.scss';
import { toast } from 'react-toastify'; // Import toast for notifications
import 'react-toastify/dist/ReactToastify.css';
import { signup } from '../../service/Auth.service';
import signInGoogle from '../../assets/images/googleSignIn_icon.svg';

    const RegisterPage: React.FC = () => {
      const [firstName, setFirstName] = useState('');
      const [lastName, setLastName] = useState('');
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [confirmPassword, setConfirmPassword] = useState('');
      const [showPassword, setShowPassword] = useState(false);
      const [showConfirmPassword, setShowConfirmPassword] = useState(false);
      const [loading, setLoading] = useState(false); // Loading state
      const navigate = useNavigate();
    
      const toggleShowPassword = () => setShowPassword(!showPassword);
      const toggleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);
    
      const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
      };
    
      const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
    
        // Check if all fields are filled
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
          toast.error('Invalid Request: All fields are required');
          return;
        }
    
        // Validate email format
        if (!validateEmail(email)) {
          toast.error('Please enter a valid email address');
          return;
        }
    
        // Check if password matches confirm password
        if (password !== confirmPassword) {
          toast.error('Passwords do not match');
          return;
        }
    
        // Validate minimum password length
        if (password.length < 8) {
          toast.error('Password must be at least 8 characters long');
          return;
        }
    
        // Disable the button by setting loading to true
        setLoading(true);
    
        const payload = {
          name: `${firstName} ${lastName}`,
          email,
          password,
        };
    
        try {
          const response = await signup(payload); // Call the API
          setLoading(false); // Re-enable the button
    
          if (response && response.status === 'success') {
            toast.success(response.message); // Show success toaster
            navigate('/login'); // Redirect to login after success
          }
        } catch (error: any) {
          setLoading(false); // Re-enable the button
          toast.error(error.response?.data?.message || 'Registration failed'); // Show error toaster
        }
      };
    

  return (
    <div className="login-page">
      {/* Left Side: Login Form */}
      <div className="login-container">
      
      <div className="form-box">
        <h1>Welcome to Myte Cody</h1>
        <p>Register to continue</p>

        <form onSubmit={handleRegister}>
        <div className="input-row">
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
          </div>
          
          <Input
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
          />
          <div className="input-row">
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
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register'} {/* Disable button and show loading state */}
          </Button>
        </form>

        <p className="redirect">
          Already have an account? <span onClick={() => navigate('/login')}>Log In</span>
        </p>

        <div className="divider">
          <span>Or continue with</span>
        </div>

        <Button type="button" className="google-signin-btn">
        <img src={signInGoogle} alt="Sign in with Google" /> Sign in with Google
        </Button>

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

export default RegisterPage;
