import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../../pages/Header/Header';
import Header from '../../pages/Navbar/Navbar';
import './LayoutPage.scss';

const LayoutPage: React.FC = () => {
  return (
    <div className="layout-page">
      {/* Static Header */}
      <Header />

      {/* Layout with Sidebar (Navbar) and Dynamic Content */}
      <div className="main-layout">
        <Navbar />

        {/* Content area where the dynamic content will be rendered */}
        <div className="content-area">
          <Outlet /> {/* This will render the dynamic page content */}
        </div>
      </div>
    </div>
  );
};

export default LayoutPage;
