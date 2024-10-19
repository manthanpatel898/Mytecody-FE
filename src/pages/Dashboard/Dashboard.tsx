import { useEffect, useState } from 'react';
import { FaTrash, FaRedo, FaDownload, FaPlus } from 'react-icons/fa';
import './Dashboard.scss'; // Include your SCSS
import { deleteProposalAPI, getProposalAPI } from '../../service/Proposal.service';
import spinner from "../../assets/spinner.svg"; // Import the spinner
import { useNavigate } from 'react-router-dom';
import { setItem } from '../../utils/localstorage-service';
import ConfirmationModal from '../../components/ConfirmationModal/ConfirmationModal';

const Dashboard = () => {
  const navigate = useNavigate();

  // Proposals state (initially empty)
  const [proposals, setProposals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [totalPages, setTotalPages] = useState(1); // Total pages from API
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const [apiCalled, setApiCalled] = useState(false); // New flag to control multiple API calls
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State for opening/closing delete modal
  const [selectedProposal, setSelectedProposal] = useState<any | null>(null); // State to store selected proposal for deletion
  const [isLoadingDelete, setLoadingDelete] = useState(false);

  // Function to fetch proposals from the API, memoized using useCallback
  const getProposal = async (page: number) => {
    if (apiCalled) return; // Prevent the API from being called again if it is already running

    setIsLoading(true); // Start loading spinner
    setApiCalled(true); // Set the API call flag to true

    try {
      const response = await getProposalAPI(page); // Pass the page number dynamically

      if (response && response.status === 'success') {
        setProposals(response.data.proposals); // Store the proposals in state
        setTotalPages(response.data.total_pages); // Set total pages dynamically from API response
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false); // Stop loading spinner, regardless of success or failure
      setApiCalled(false); // Reset the API call flag
    }
  };

  // Call the getProposal function once when the component loads or when currentPage changes
  useEffect(() => {
    getProposal(currentPage);
  }, []); // Add getProposal and currentPage as dependencies

  // Function to create a new proposal
  const createProposal = () => {
    localStorage.removeItem("proposal_id");
    navigate("/steps1");
  };

  // Pagination controls
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1); // Decrease the current page
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1); // Increase the current page
    }
  };

  const navigateStep = (proposal: any) => {
    setItem('proposal_id', proposal._id); // Store the proposal_id in localStorage
    if (proposal.step === 0) { navigate('/steps1') }
    else navigate(`/steps${proposal.step}`);
  };

  // Function to open the delete confirmation modal
  const handleDeleteClick = (proposal: any) => {
    setSelectedProposal(proposal); // Set the proposal to be deleted
    setIsDeleteModalOpen(true); // Open the confirmation modal
  };

  const confirmDelete = async () => {
    setLoadingDelete(true);
    try {
      const response = await deleteProposalAPI(selectedProposal._id); // Call the correct API for deleting a proposal
      if (response.status === 'success') {
        // After successful deletion, remove the deleted proposal from the local state
        setProposals((prevProposals) =>
          prevProposals.filter((proposal) => proposal._id !== selectedProposal._id)
        );
        setIsDeleteModalOpen(false); // Close the delete modal
      }
    } catch (error) {
      console.error('Failed to delete proposal:', error); // Handle any errors during deletion
    } finally {
      setLoadingDelete(false); // Ensure the loading state is reset
    }
  };

  return (
    <div className="dashboard-container">
      {/* Show spinner when loading */}
      {isLoading ? (
        <div className="spinner-container">
          <img src={spinner} alt="Loading..." className="spinner-img" />
        </div>
      ) : (
        <>
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
                <p>{proposals.filter((p) => p.status === 'completed').length}</p>
              </div>
              <div className="stat-card">
                <h4>Total In-Progress proposals</h4>
                <p>{proposals.filter((p) => p.status === 'in-progress').length}</p>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="content-section">
            <div className="proposals-header">
              <h2>Latest Proposals</h2>
              <div className="add-proposal-icon-container" onClick={createProposal}>
                <FaPlus className="add-proposal-icon" />
                <span className="add-proposal-text">Build Your Dream</span>
              </div>
            </div>
            <div className="proposal-list">
              <div className="proposal-cards">
                {proposals.map((proposal, index) => (
                  <div className="proposal-card" key={index}>
                    <div className="proposal-header">
                      <span className="proposal-number">{proposal.title}</span>
                      <span className={`status-badge ${proposal.status === 'completed' ? 'completed' : 'in-progress'}`}>
                        {proposal.status === 'completed' ? 'Completed' : 'In-Progress'}
                      </span>
                    </div>
                    <div className='proposal-token'>
                      <span className="proposal-number">    Token Used: {proposal.tokens_used.toLocaleString('en-US')}
                      </span>
                    </div>
                    <div className="proposal-info">
                      <strong>Proposal For</strong>
                      <div>{proposal.description}</div>
                    </div>
                    <div className="action-buttons">
                      {proposal.status === 'in-progress' ? (
                        <button className="btn resume-btn" onClick={() => { navigateStep(proposal) }}>
                          <FaRedo /> Resume
                        </button>
                      ) : (
                        <button className="btn email-btn" onClick={() => { navigateStep(proposal) }}>
                          <FaDownload /> Download Proposal
                        </button>
                      )}
                      <button className="btn delete-btn" onClick={() => handleDeleteClick(proposal)}>
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
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

          {/* Confirmation Modal */}
          {isDeleteModalOpen && (
            <ConfirmationModal
              title="Delete Proposal"
              message={`Are you sure you want to delete the proposal "${selectedProposal?.title}"?`}
              onConfirm={confirmDelete}
              onCancel={() => setIsDeleteModalOpen(false)}
              isLoading={isLoadingDelete}
            />
          )}

        </>
      )}
    </div>
  );
};

export default Dashboard;