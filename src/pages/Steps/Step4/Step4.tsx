import './Step4.scss'; // Include your SCSS
import Title from '../../../components/Title/Title';
import { useEffect, useRef, useState } from 'react';
import spinner from '../../../assets/spinner.svg';
import { getStackholderAPI, saveStackholderAPI } from '../../../service/Proposal.service'; // Import saveStackholderAPI and getWalletInfoAPI
import { AddnewIcon } from '../../../assets/addnew_icon';
import { CheckMarkBlueIcon } from '../../../assets/checkMarkBlue_icon';
import { EditIcon } from '../../../assets/edit_icon';
import { DeleteIcon } from '../../../assets/delete_icon';
import WalletTokenWarning from '../../../components/WalletTokenWarning/WalletTokenWarning'; // Import WalletTokenWarning
import { getWalletInfoAPI } from '../../../service/Wallet.service';

const Step4 = ({ isActive, setActiveStep, step4Data }: any) => {
  const [isLoading, setIsLoading] = useState(true); // Loader until content loads
  const [proposalId, setProposalId] = useState<string | null>(null);
  const [isSubmitStackholderData, setIsSubmitStackholderData] = useState(false); // For disabling button and showing loader
  const [stackHolderData, setStackHolderData] = useState<any>([]);
  const [editBtn, setEditBtn] = useState(false); // Control edit functionality
  const [isEdit, setIsEdit] = useState(false);
  const [editIndex, setEditIndex] = useState(-1);
  const [isWalletWarningVisible, setIsWalletWarningVisible] = useState(false); // Show pop-up for insufficient tokens

  // Scroll to the bottom of the message container
  const scrollToBottom = () => {
    const messageEndRef = document.getElementById('messageEndRef');
    if (messageEndRef) {
      messageEndRef.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Save Stackholder Data Function
  const saveStackholderData = async () => {
    if (!proposalId) return;

    setIsSubmitStackholderData(true); // Disable button and show loader

    // Create the payload
    const payload = {
      proposal_id: proposalId,
      stake_holders: stackHolderData, // Pass the stackholder data
    };

    try {
      const response = await saveStackholderAPI(payload); // Call the API to save stackholder data

      if (response && response.status === 'success') {
        setActiveStep('STEPS5'); // Move to Step 5 after success
      }
    } catch (error) {
      console.error('Error while saving stackholder data:', error);
    } finally {
      setIsSubmitStackholderData(false); // Enable button and hide loader after API response
    }
  };

  // Fetch stackholder data if step4Data is not available
  const fetchStackholderData = async (proposalId: string) => {
    try {
      const response = await getStackholderAPI(proposalId); // Call API to fetch stackholder data

      if (response?.status === 'success') {
        setStackHolderData(response.data.stake_holders); // Set fetched stackholder data
      }
    } catch (error) {
      console.error('Error fetching stackholder data:', error);
    } finally {
      setIsLoading(false); // Stop loader after data is loaded
    }
  };

  const addnewData = () => {
    setStackHolderData([...stackHolderData, '']);
  };

  // Fetch wallet info and check if tokens are available
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

  // Fetch project details and set step4Data into stackholderData when component becomes active
  useEffect(() => {
    const storedProposalId = localStorage.getItem('proposal_id'); // Ensure proposal_id is fetched from localStorage
    setProposalId(storedProposalId);

    fetchWalletInfo(); // Check wallet info before proceeding

    if (!isWalletWarningVisible && isActive && storedProposalId) {
      if (step4Data) {
        setStackHolderData(step4Data);
        setIsLoading(false); // Content has loaded, so stop showing loader
      } else {
        fetchStackholderData(storedProposalId);
      }
    }
  }, [isActive, step4Data, isWalletWarningVisible]); // Run when the component becomes active

  return (
    <div className="stackholder-container">
      {isLoading ? (
        <div className="spinner-ldr">
          <img src={spinner} alt="Loading..." />
        </div>
      ) : isWalletWarningVisible ? (
        <WalletTokenWarning /> // Show Wallet Token Warning pop-up if tokens are insufficient
      ) : (
        <div className="stackholder-details-content">
          <div className="title-img">
            <Title title="Identify users of the application/website" />
          </div>

          <div className="content-inner-wrap">
            <p>
              These are the potential users that have a unique set of tools on your platform. Feel free to remove users, or add users you think have completely unique set of tools.
            </p>
            <div className="business-users-title">
              <h3>Business Users</h3>
              {isEdit && (
                <div style={{ cursor: 'pointer' }} onClick={addnewData}>
                  <AddnewIcon /> <h3>Add new</h3>
                </div>
              )}
            </div>
            <div className="business-users-wrap">
              {stackHolderData.map((item: any, index: number) => (
                <div className="business-users" key={index}>
                  <span className="user-check">
                    <CheckMarkBlueIcon />
                  </span>
                  <input
                    onChange={(e) =>
                      setStackHolderData([
                        ...stackHolderData.slice(0, index),
                        e.target.value,
                        ...stackHolderData.slice(index + 1),
                      ])
                    }
                    className={editIndex === index ? 'form-control' : 'form-control disabled'}
                    type="text"
                    value={item}
                  />
                  {isEdit && (
                    <div className="edit-delete-wrap">
                      <span onClick={() => setEditIndex(index)}>
                        <EditIcon />
                      </span>
                      <span
                        onClick={() => {
                          const data = [...stackHolderData];
                          data.splice(index, 1);
                          setStackHolderData(data);
                        }}
                      >
                        <DeleteIcon />
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>


        </div>
      )}

      <div className="buttons">
        <button onClick={() => setEditBtn(true)} className="btn btn-primary getStartedBtn">
          Let Me Modify
        </button>

        <button onClick={saveStackholderData} className={isSubmitStackholderData ? 'btn' : 'btn btn-primary'} disabled={isSubmitStackholderData}>
          {isSubmitStackholderData ? <img src={spinner} alt="spinner Icon" width={24} /> : 'Submit'}
        </button>
      </div>
      <div id="messageEndRef"></div>
    </div>
  );
};

export default Step4;
