import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTachometerAlt, faFileAlt, faWallet } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';
import './Navbar.scss';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false); // Manage sidebar open/close state for small screens
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 768);
  const navbarRef = useRef<HTMLDivElement>(null);

  // Handle window resize to toggle between desktop and small screen
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Toggle sidebar visibility for small screens
  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  // Close sidebar when clicking outside of it on small screens
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target as Node) && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <>
      {isSmallScreen && (
        <button className="hamburger-icon" onClick={toggleNavbar}>
          <FontAwesomeIcon icon={faBars} />
        </button>
      )}

      <div ref={navbarRef} className={`navbar ${isOpen ? 'open' : ''}`}>
        <ul className="nav-items">
          <li className="nav-item">
            <NavLink 
              to="/dashboard" 
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              <FontAwesomeIcon icon={faTachometerAlt} />
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink 
              to="/proposals" 
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              <FontAwesomeIcon icon={faFileAlt} />
              <span>Proposals</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink 
              to="/wallet" 
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              <FontAwesomeIcon icon={faWallet} />
              <span>Wallet</span>
            </NavLink>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Navbar;
