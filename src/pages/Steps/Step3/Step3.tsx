import './Step3.scss'; // Include your SCSS
import Title from '../../../components/Title/Title';
import { useEffect, useRef, useState } from 'react';
import spinner from '../../../assets/spinner.svg';
import { getBusinessVerticalAPI, saveBusinessVerticalAPI } from '../../../service/Proposal.service'; // Import saveBusinessVerticalAPI and getWalletInfoAPI
import WalletTokenWarning from '../../../components/WalletTokenWarning/WalletTokenWarning'; // Import the WalletTokenWarning pop-up
import { getWalletInfoAPI } from '../../../service/Wallet.service';

const Step3 = ({ isActive, setActiveStep, step3Data, setStep4Data }: any) => {
  const [isLoading, setIsLoading] = useState(true); // Loader until content loads
  const [proposalId, setProposalId] = useState<string | null>(null);
  const [isSubmitBusinessVertical, setIsSubmitBusinessVertical] = useState(false); // For disabling button and showing loader
  const [businessData, setBusinessData] = useState<any>([]); // Data for business vertical
  const [editBtn, setEditBtn] = useState(false); // Control edit functionality
  const [isWalletWarningVisible, setIsWalletWarningVisible] = useState(false); // Show pop-up for insufficient tokens
  const messageEndRef = useRef<HTMLDivElement>(null);

  // Scroll to the bottom of the message container
  const scrollToBottom = () => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Save Business Vertical Function
  const saveBusinessVertical = async () => {
    if (!proposalId) return;

    setIsSubmitBusinessVertical(true); // Disable button and show loader

    // Create the payload
    const payload = {
      proposal_id: proposalId,
      business_vertical: businessData, // Pass the businessData array
    };

    try {
      const response = await saveBusinessVerticalAPI(payload); // Call the API to save business vertical

      if (response && response.status === 'success') {
        setStep4Data(response.data.stake_holders); // Pass data to Step 4
        setActiveStep('STEPS4'); // Move to Step 4 after success
      }
    } catch (error) {
      console.error("Error while saving business vertical:", error);
    } finally {
      setIsSubmitBusinessVertical(false); // Enable button and hide loader after API response
    }
  };

  // Let Me Modify Button Click Function
  const correctbtnClick = () => {
    setEditBtn(true); // Enable the input field for editing
  };

  // Fetch business vertical if step3Data is not available
  const fetchBusinessVertical = async (proposalId: string) => {
    try {
      const response = await getBusinessVerticalAPI(proposalId); // Call API to fetch business vertical

      if (response?.status === 'success') {
        setBusinessData(response.data); // Set fetched business vertical
      }
    } catch (error) {
      console.error("Error fetching business vertical:", error);
    } finally {
      setIsLoading(false); // Stop loader after data is loaded
    }
  };

  // Fetch wallet info and project details when component becomes active
  useEffect(() => {
    const storedProposalId = localStorage.getItem("proposal_id"); // Ensure proposal_id is fetched from localStorage
    setProposalId(storedProposalId);

    const fetchWalletInfo = async () => {
      try {
        const response = await getWalletInfoAPI();
        if (response?.status === 'success') {
          const availableTokens = response.data.availableTokens;
          if (availableTokens <= 0) {
            setIsWalletWarningVisible(true); // Show wallet warning if tokens are insufficient
            return; // Do not proceed further if tokens are insufficient
          }
        }
      } catch (error) {
        console.error('Error fetching wallet info:', error);
      }
    };

    fetchWalletInfo(); // Fetch wallet info before loading the component

    if (!isWalletWarningVisible && isActive && storedProposalId) {
      if (step3Data) {
        // If step3Data is provided, use it
        setBusinessData(step3Data);
        setIsLoading(false); // Content has loaded, so stop showing loader
      } else {
        // If no step3Data, fetch business vertical using the proposalId
        fetchBusinessVertical(storedProposalId);
      }
    }
  }, [isActive, step3Data, isWalletWarningVisible]); // Run when the component becomes active

  return (
    <div className="business-container">
      {isLoading ? (
        <div className="loading-overlay" id="loadingOverlay">
        <div className="spinner-ldr">
          <img src={spinner} alt="Loading..." />
        </div>
        </div>
      ) : isWalletWarningVisible ? (
        <WalletTokenWarning /> // Show Wallet Token Warning pop-up if tokens are insufficient
      ) : (
        <div className="business-details-content">
          <div className="title-img">
            <Title title="Identify the business vertical" />
          </div>
          <div className="content-inner-wrap">
            <p>
              Based on our conversation, does this business vertical make sense to you? Feel free to modify it as needed.
            </p>
            <h3>Business Vertical</h3>
            <input
              disabled={!editBtn} // Disable the input field unless user clicks "Let Me Modify"
              className="form-control"
              onChange={(event) =>
                setBusinessData([event.target.value]) // Set the new business vertical on change
              }
              value={businessData[0] || ''} // Bind the input field to the businessData state
              type="text"
            />
          </div>
          <div className="message-content">
            <div ref={messageEndRef}></div>
          </div>
        </div>
      )}

      <div className="buttons">
        <button
          onClick={correctbtnClick}
          className="btn btn-primary getStartedBtn"
        >
          Let Me Modify
        </button>

        <button
          onClick={saveBusinessVertical}
          className={isSubmitBusinessVertical ? "btn" : "btn btn-primary"} // Disable button during API call
          disabled={isSubmitBusinessVertical} // Disable button when loading
        >
          {isSubmitBusinessVertical ? (
            <img src={spinner} alt="spinner Icon" width={24} />
          ) : (
            "Submit"
          )}
        </button>
      </div>
    </div>
  );
};

export default Step3;
