import React from 'react';
import Header from '../Header/Header';
import Navbar from '../Navbar/Navbar';
import './Dashboard.scss';

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard">
      <Header />
      <Navbar/>
    </div>
  );
};

export default Dashboard;
