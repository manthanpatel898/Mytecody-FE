import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import './Header.scss'; // Assuming we are using SCSS for styling

const Header: React.FC = () => {
  return (
    <header className="app-header">
      <div className="logo-container">
        <FontAwesomeIcon icon={faUserCircle} className="logo-icon" />
        <h1 className="logo-text">LAM AI</h1>
      </div>

      <div className="header-right">
        <FontAwesomeIcon icon={faCog} className="icon settings-icon" />
        <div className="profile-info">
          <span>Hey Ashish!</span>
          <FontAwesomeIcon icon={faUserCircle} className="icon profile-icon" />
        </div>
      </div>
    </header>
  );
};

export default Header;
