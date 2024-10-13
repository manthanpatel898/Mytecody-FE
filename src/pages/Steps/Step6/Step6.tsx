import React, { useEffect, useState } from 'react';
import Title from '../../../components/Title/Title';
import './Step6.scss'; // Include your SCSS
import { generateProposalAPI, sendProposalAPI } from '../../../service/Proposal.service'; // Import the APIs
import { getWalletInfoAPI } from '../../../service/Wallet.service'; // Import wallet info API
import spinner from '../../../assets/spinner.svg'; // Assuming you have a spinner icon
import { DownloadIcon } from '../../../assets/download_icon';
import WalletTokenWarning from '../../../components/WalletTokenWarning/WalletTokenWarning'; // Import the wallet warning pop-up

const Step6 = ({ setActiveStep }: any) => {
  const [isLoading, setIsLoading] = useState(true); // State for loader
  const [isSendingProposal, setIsSendingProposal] = useState(false); // State for send proposal button
  const [proposalData, setProposalData] = useState<any>(null); // State to store proposal data
  const [proposalId, setProposalId] = useState<string | null>(null); // State for proposal ID
  const [isWalletWarningVisible, setIsWalletWarningVisible] = useState(false); // State for wallet warning

  // Fetch Wallet Info and Proposal Data when component mounts
  useEffect(() => {
    const storedProposalId = localStorage.getItem("proposal_id"); // Get proposal_id from localStorage
    if (storedProposalId) {
      setProposalId(storedProposalId);
      fetchWalletInfo(); // Fetch wallet info before loading the proposal
    }
  }, []);

  // Fetch wallet info and check if tokens are available
  const fetchWalletInfo = async () => {
    try {
      const response = await getWalletInfoAPI(); // Fetch wallet info
      if (response?.status === 'success') {
        const availableTokens = response.data.availableTokens;
        if (availableTokens <= 0) {
          setIsWalletWarningVisible(true); // Show wallet warning if tokens are insufficient
          return; // Stop further actions if tokens are insufficient
        }
        // Fetch proposal data if tokens are sufficient
        if (proposalId) {
          fetchProposalData(proposalId);
        }
      }
    } catch (error) {
      console.error('Error fetching wallet info:', error);
    }
  };

  const fetchProposalData = async (id: string) => {
    setIsLoading(true); // Show loader during API call
    try {
      const response = await generateProposalAPI(id); // Call the API
      if (response?.status === 'success') {
        setProposalData(response.data); // Store the proposal data
      } else {
        console.error('Error generating proposal:', response);
      }
    } catch (error) {
      console.error('Failed to generate proposal:', error);
    } finally {
      setIsLoading(false); // Hide loader after API call
    }
  };

  const sendProposal = async (id: string) => {
    setIsSendingProposal(true); // Disable the button and show loader
    try {
      const response = await sendProposalAPI(id); // Call the API to send the proposal
      if (response?.status === 'success') {
        console.log('Proposal sent successfully.');
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

  return (
    <div className="final-proposal-container">
      {isLoading ? (
        <div className="spinner-ldr">
          <img src={spinner} alt="Loading..." />
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
                      <button
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
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Buttons Section */}

        </div>
      )}
      <div className="buttons">
        <button className="btn btn-primary" onClick={handleNext}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default Step6;
