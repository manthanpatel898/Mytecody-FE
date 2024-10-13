import React from 'react';
import './WalletTokenWarning.scss'; // Include your SCSS
import { useNavigate } from 'react-router-dom'; // Assuming you use react-router-dom for navigation
import { BackHomeIcon } from '../../assets/backhome_icon';

const WalletTokenWarning: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="wallet-warning-overlay">
      <div className="wallet-warning-modal">
        <h2>Insufficient Token Balance</h2>
        <p>You can't process further. Please recharge your wallet.</p>
        <div className='btn-position'>
        <button className="btn" onClick={() => navigate("/dashboard")}>
          <BackHomeIcon color='#fff' /> Home
        </button>
        </div>
      </div>
    </div>
  );
};

export default WalletTokenWarning;
