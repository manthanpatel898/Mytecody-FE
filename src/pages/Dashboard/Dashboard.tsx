import React, { useState } from 'react';
import { FaTrash, FaRedo, FaDownload } from 'react-icons/fa';
import './Dashboard.scss'; // Include your SCSS

const Dashboard = () => {
  // Sample proposals data (add more for pagination demo)
  const proposals = [
    {
      id: '#00102162024',
      status: 'In-Progress',
      description: 'Document management system for real-estate material lab',
      buttonLabel: 'Resume',
      isCompleted: false,
    },
    {
      id: '#00102162025',
      status: 'Completed',
      description: 'Document management system for real-estate material lab',
      buttonLabel: 'Download Proposal',
      isCompleted: true,
    },
    {
      id: '#00102162026',
      status: 'In-Progress',
      description: 'Document management system for real-estate material lab',
      buttonLabel: 'Resume',
      isCompleted: false,
    },
    {
      id: '#00102162027',
      status: 'In-Progress',
      description: 'Document management system for real-estate material lab',
      buttonLabel: 'Resume',
      isCompleted: false,
    },
    {
      id: '#00102162028',
      status: 'Completed',
      description: 'Document management system for real-estate material lab',
      buttonLabel: 'Email Proposal',
      isCompleted: true,
    },
    {
      id: '#00102162029',
      status: 'In-Progress',
      description: 'Document management system for real-estate material lab',
      buttonLabel: 'Resume',
      isCompleted: false,
    },
    {
      id: '#00102162030',
      status: 'Completed',
      description: 'Document management system for real-estate material lab',
      buttonLabel: 'Email Proposal',
      isCompleted: true,
    },
  ];

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 6;

  // Calculate total pages
  const totalPages = Math.ceil(proposals.length / recordsPerPage);

  // Get current records for the page
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = proposals.slice(indexOfFirstRecord, indexOfLastRecord);

  // Pagination controls
  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="dashboard-container">
  {/* Stats Section */}
  <div className="stats-section">
    <h2>Stats.</h2>
    <div className="stats-cards">
      <div className="stat-card">
        <h4>Total # of Proposals</h4>
        <p>{proposals.length}</p>
      </div>
      <div className="stat-card">
        <h4>Total completed proposals</h4>
        <p>{proposals.filter(p => p.isCompleted).length}</p>
      </div>
      <div className="stat-card">
        <h4>Total In-Progress proposals</h4>
        <p>{proposals.filter(p => !p.isCompleted).length}</p>
      </div>
    </div>
  </div>

  {/* Scrollable Content Section */}
  <div className="content-section">
    <div className="proposals-section">
      <h2>Latest Proposals</h2>
      <div className="proposal-cards">
        {currentRecords.map((proposal, index) => (
          <div className="proposal-card" key={index}>
            <div className="proposal-header">
              <span className="proposal-number">{proposal.id}</span>
              <span className={`status-badge ${proposal.isCompleted ? 'completed' : 'in-progress'}`}>
                {proposal.isCompleted ? 'Completed' : 'In-Progress'}
              </span>
            </div>
            <div className="proposal-info">
              <strong>Proposal For</strong>
              <div>{proposal.description}</div>
            </div>
            <div className="action-buttons">
              {proposal.isCompleted ? (
                <button className="btn email-btn">
                  <FaDownload /> {proposal.buttonLabel}
                </button>
              ) : (
                <button className="btn resume-btn">
                  <FaRedo /> {proposal.buttonLabel}
                </button>
              )}
              <button className="btn delete-btn">
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="pagination-controls">
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  </div>

  {/* Footer Section */}
  <div className="footer-section">
    <button className="footer-btn">
      Begin a new project - Dream & Build
      <span>Ask For Estimations</span>
    </button>
  </div>
</div>

  );
};

export default Dashboard;
