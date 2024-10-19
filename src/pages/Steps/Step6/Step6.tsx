import { useEffect, useState } from 'react';
import Title from '../../../components/Title/Title';
import './Step6.scss'; // Include your SCSS
import { generateProposalAPI, sendProposalAPI } from '../../../service/Proposal.service'; // Import the APIs
import { getWalletInfoAPI } from '../../../service/Wallet.service'; // Import wallet info API
import spinner from '../../../assets/spinner.svg'; // Assuming you have a spinner icon
import { DownloadIcon } from '../../../assets/download_icon';
import WalletTokenWarning from '../../../components/WalletTokenWarning/WalletTokenWarning'; // Import the wallet warning pop-up
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import ProfileCompletionPopUp from '../../../components/ProfileCompletionPopUp/ProfileCompletionPopUp'; // Import custom ProfileCompletionPopUp
import { getIndividualProfileAPI } from '../../../service/IndividualProfile.service';
import { toast } from 'react-toastify';

const Step6 = ({ setActiveStep }: any) => {
  const [isLoading, setIsLoading] = useState(false); // State for loader
  const [isSendingProposal, setIsSendingProposal] = useState(false); // State for send proposal button
  const [proposalData, setProposalData] = useState<any>(null); // State to store proposal data
  const [proposalId, setProposalId] = useState<string | null>(null); // State for proposal ID
  const [isWalletWarningVisible, setIsWalletWarningVisible] = useState(false); // State for wallet warning
  const [showProfilePopUp, setShowProfilePopUp] = useState(false); // Show/hide profile completion pop-up
  const navigate = useNavigate(); // Initialize useNavigate for navigation

  // Fetch wallet info and check if tokens are available
  const fetchWalletInfo = async () => {
    try {
      const response = await getWalletInfoAPI(); // Fetch wallet info
      if (response?.status === 'success') {
        const availableTokens = response.data.availableTokens;
        if (availableTokens <= 0) {
          setIsWalletWarningVisible(true); // Show wallet warning if tokens are insufficient
        } else {
          // Fetch proposal data if tokens are sufficient
          if(proposalId)
          await fetchProposalData(proposalId);
        }
      }
    } catch (error) {
      console.error('Error fetching wallet info:', error);
    } finally {
      setIsLoading(false); // Hide loader after checking wallet and proposal data
    }
  }

  // Fetch individual profile
  const fetchIndividualProfile = async () => {
    try {
      const response = await getIndividualProfileAPI(); // Call the API
      if (response?.status === "success" && response.data) {
        const profile = response.data;
        if (profile.logo_image) {
          fetchWalletInfo(); // Fetch wallet info because profile is complete
          setIsLoading(true);
        } else {
          setShowProfilePopUp(true); // Show pop-up if profile is incomplete
        }
      } else {
        setShowProfilePopUp(true); // Show pop-up if profile data is missing
      }
    } catch (error) {
      console.error("Error fetching individual profile:", error);
      setShowProfilePopUp(true); // Show pop-up on error as well
    }
  }

  const fetchProposalData = async (id: string) => {
    try {
      const response = await generateProposalAPI(id); // Call the API
      if (response?.status === 'success') {
        setProposalData(response.data); // Store the proposal data
      } else {
        console.error('Error generating proposal:', response);
      }
    } catch (error) {
      console.error('Failed to generate proposal:', error);
    }
  };

  const sendProposal = async (id: string) => {
    setIsSendingProposal(true); // Disable the button and show loader
    try {
      const response = await sendProposalAPI(id); // Call the API to send the proposal
      if (response?.status === 'success') {
        console.log('Proposal sent successfully.');
        toast.success('Proposal sent successfully.')
      } else {
        console.error('Error sending proposal:', response);
      }
    } catch (error) {
      console.error('Failed to send proposal:', error);
    } finally {
      setIsSendingProposal(false); // Re-enable the button after API call
    }
  };

  const handleNext = () => {
    setActiveStep('STEPS2'); // Move to the next step
  };

  // Handle "Skip" button click
  const handleSkip = () => {
    setShowProfilePopUp(false); // Close the pop-up
    setIsLoading(true);
    fetchWalletInfo(); // Fetch wallet info after the user skips
  };

  // Handle "My Profile" button click to redirect to the individual profile page
  const handleMyProfile = () => {
    setShowProfilePopUp(false);
    navigate('/individual-profile'); // Redirect to individual profile page
  };

  useEffect(() => {
    const storedProposalId = localStorage.getItem("proposal_id"); // Get proposal_id from localStorage
    if (storedProposalId) {
      setProposalId(storedProposalId);
    } else {
      setIsLoading(false); // Stop loading if no proposal ID is found
    }
  }, []);
  
  // New useEffect to handle fetching profile and wallet info once proposalId is set
  useEffect(() => {
    if (proposalId) {
      fetchIndividualProfile(); // Fetch the individual profile data
    }
  }, [proposalId]); // Only fetch the profile and wallet info after proposalId is set

  return (
    <div className="final-proposal-container">
      {isLoading ? (
        <div className="loading-overlay" id="loadingOverlay">
          <div className="spinner-ldr">
            <img src={spinner} alt="Loading..." />
          </div>
        </div>
      ) : isWalletWarningVisible ? ( // Display wallet warning if insufficient tokens
        <WalletTokenWarning />
      ) : (
        <div className="final-proposal-details-content">
          <div className="title-img">
            <Title title="Proposal Summary" />
          </div>
          {/* Proposal Data Section */}
          <div className="proposal-content">
            <div className="content">
              <div className="content-inner-wrap">
                {proposalData && (
                  <div className="content-tech-wrap">
                    <h3>Proposal Title - {proposalData?.ProjectTitle}</h3>
                    <div className="user-proposal-wrap">
                      <h4>Project Description</h4>
                      <p>{proposalData?.ExecutiveSummary}</p>
                      <div className="table-wrap">
                        <div className="tab-col">
                          <h5>Estimated Hours </h5>
                          <span>
                            {new Intl.NumberFormat("en-US").format(proposalData?.Budget?.TotalEstimatedHours)} hours
                          </span>
                        </div>
                        <div className="tab-col">
                          <h5>Total Estimated Cost</h5>
                          <span>
                            {new Intl.NumberFormat("en-CA", {
                              style: "currency",
                              currency: "CAD",
                            }).format(proposalData?.Budget?.TotalEstimatedCost)}
                          </span>
                        </div>
                        <div className="tab-col">
                          <h5>Timeline</h5>
                          <span>
                            {(proposalData?.Budget?.TotalEstimatedHours / 160).toFixed(2)} months
                          </span>
                        </div>
                        <div className="tab-col">
                          <h5>Used Tokens</h5>
                          <span>{proposalData?.token_used?.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Email Proposal Button */}
                      {/* <button
                        onClick={() => proposalId && sendProposal(proposalId)}
                        className="btn btn-primary"
                        disabled={isSendingProposal} // Disable button while sending
                      >
                        {isSendingProposal ? (
                          <img src={spinner} alt="Sending..." width={24} /> // Show spinner when sending
                        ) : (
                          <>
                            <DownloadIcon /> Email Proposal
                          </>
                        )}
                      </button> */}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Completion Pop-Up */}
      {showProfilePopUp && (
        <ProfileCompletionPopUp
          show={showProfilePopUp}
          onClose={handleSkip} // Call fetchWalletInfo on skip
          onMyProfile={handleMyProfile}
        />
      )}

      <div className="buttons">
        <button className="btn btn-primary" onClick={() => proposalId && sendProposal(proposalId)}>
          {isSendingProposal ? (
            <img src={spinner} alt="Sending..." width={24} /> // Show spinner when sending
          ) : (
            <>
              <DownloadIcon /> Email Proposal
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Step6;