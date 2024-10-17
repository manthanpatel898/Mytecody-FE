import React, { useState } from 'react';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import { useNavigate } from 'react-router-dom';
import './LoginPage.scss';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { login } from '../../service/Auth.service'; // Import your login API service
import { setItem } from '../../utils/localstorage-service'; // Assume you have these helpers
import signInGoogle from '../../assets/images/googleSignIn_icon.svg';
import { useGoogleLogin } from '@react-oauth/google'; // Assuming you're using react-oauth/google
// import CryptoJS from 'crypto-js'; // Import the encryption library

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // To disable the button while processing
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleForgotPasswordClick = () => {
    navigate('/forgot-password');
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    // Field validation
    if (!email || !password) {
      toast.error('Both fields are required');
      return;
    }

    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    // Disable the button while the request is processing
    setLoading(true);

    const payload = { email, password };

    try {
      const response = await login(payload); // Call the login API

      // Assuming success status means success
      if (response && response.status === 'success') {
        setItem('token', response.data.access_token); // Store token in localStorage
        setItem('userInfo',JSON.stringify(response.data.user))
        toast.success(response.message);
        navigate('/dashboard'); // Navigate to dashboard or another page
      } else {
        throw new Error('Login failed');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false); // Re-enable the button after the process completes
    }
  };

  // Google SSO function using the `useGoogleLogin` hook
  const GoogleLogin = useGoogleLogin({
    onSuccess: async (codeResponse:any) => {
      try {
        // Fetch user information from Google's OAuth API using the access token
        const userInfoResponse = await fetch(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${codeResponse.access_token}`,
            },
          }
        );
        const userInfo = await userInfoResponse.json();

        // Store the user info in localStorage
        setItem('userInfo', JSON.stringify(userInfo));

        // Call your backend API to handle login/signup with Google SSO
        const loginResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: userInfo.email,
            oauth_type: 'google',
            oauth_access_token: codeResponse.access_token,
            name: userInfo.name,
          }),
        });

        const loginData = await loginResponse.json();

        if (loginData?.data?.access_token) {
          // Store the token and user info in localStorage
          setItem('access_token', loginData.data.access_token);
          setItem('userInfo', JSON.stringify(loginData.data.user));

          toast.success('Google Sign-In Successful');
          navigate('/dashboard'); // Redirect to dashboard
        } else {
          throw new Error('Google Sign-In Failed');
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error('Google Sign-In Failed');
      }
    },
    onError: (error:any) => {
      console.error('Login Failed:', error);
      toast.error('Google Sign-In Failed');
    },
    include_granted_scopes: true,
  });

  return (
    <div className="login-page">
      {/* Left Side: Login Form */}
      <div className="login-container">
      
      <div className="form-box">
      <h1>Welcome to Myte Cody</h1>
      <p>Login to continue</p>
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
          <Button type="submit" disabled={loading}>
            {loading ? <div className="loader"></div> : 'Sign In'} {/* Disable button during processing */}
          </Button>
        </form>
        <div className="signup">
          <p className="redirect">
            Don’t have an account? <span onClick={() => navigate('/register')}>Sign Up</span>
          </p>
        </div>
        <div className="separator">
          <span>Or continue with</span>
        </div>
        <Button type="button" className="google-signin-btn" onClick={GoogleLogin}>
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

export default LoginPage;
