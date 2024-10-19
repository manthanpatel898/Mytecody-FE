import './Step1.scss'; // Include your SCSS
import Title from '../../../components/Title/Title';
import volume from "../../../assets/volume.svg";
import { useCallback, useEffect, useRef, useState } from 'react';
import Messages from '../../../components/message/Message';
import { generateConversationAPI, getConversation, saveConversationAPI } from '../../../service/Proposal.service'; // Added getWalletInfoAPI
import spinner from '../../../assets/spinner.svg';
import { MicrophoneIcon } from "../../../assets/microphone_icon";
import SpeechToText from '../../../components/SpeechToText/SpeechToText';
import WalletTokenWarning from '../../../components/WalletTokenWarning/WalletTokenWarning'; // Import WalletTokenWarning
import { setItem } from '../../../utils/localstorage-service';
import { getWalletInfoAPI } from '../../../service/Wallet.service';
import InfoPopup from '../../../components/InfoPopup/InfoPopup';

interface Message {
  senderType: string;
  message: string;
  isEdit?: boolean;
}

const Step1 = ({ setActiveStep, setStep2Data }: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [proposalId, setProposalId] = useState<string | null>(null);
  const [isSpeechModelActive, setIsSpeechModelActive] = useState(false);
  const [isBtnProcess, setIsBtnProcess] = useState(false);
  const [isWalletWarningVisible, setIsWalletWarningVisible] = useState(false); // New state to show wallet warning
  const messageEndRef = useRef<HTMLDivElement>(null);
  const [isLoadingProcess, setisLoadingProcess] = useState(false);
  const [parentResults, setParentResults] = useState<string | null>(null); // Changed to string | null
  const [isplay, setIsplay] = useState(false);
  const [resetMessage, setresetMessage] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isConversationSubmit, setIsConversationSubmit] = useState(false);
  const [showMicPopup, setShowMicPopup] = useState(false);

  // Default message if no proposal or conversation is found
  const setDefaultMessage = () => {
    setMessages([
      {
        senderType: "AISender",
        message: "Please provide insights into your project requirements, allowing me to gain a comprehensive understanding. Share details about your business needs and articulate the specific goals of the software or solution you seek.",
        isEdit: false,
      },
    ]);
    scrollToBottom(); // Scroll to the bottom after setting the default message
  };

  // Scroll to the bottom of the message container
  const scrollToBottom = () => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Handle microphone button click
  const handleMicClick = () => {
    // Show pop-up for 5 seconds
    setShowMicPopup(true);
    setTimeout(() => {
      setShowMicPopup(false);
    }, 5000);

    setIsSpeechModelActive(true);
    setIsRecording(true);
    setMessages((prevMessages) => {
      if (
        prevMessages.length === 0 ||
        prevMessages[prevMessages.length - 1].senderType !== "humanSender"
      ) {
        const newMessageObject: Message = {
          senderType: "humanSender",
          message: "",
          isEdit: true,
        };
        return [...prevMessages, newMessageObject];
      }
      return prevMessages;
    });
    scrollToBottom(); // Ensure we scroll to bottom when user starts a conversation
  };

  const handleParentResults = (newMessage: string) => {
    if (newMessage.length > 0) {
      setMessages((prevMessages) => {
        const lastMessage = prevMessages[prevMessages.length - 1];

        // Prevent running twice by checking if the newMessage is already part of the last message
        if (lastMessage && lastMessage.senderType === "humanSender") {
          if (!lastMessage.message.includes(newMessage)) { // Check if newMessage has already been appended
            lastMessage.message += ` ${newMessage}`;  // Append to last humanSender message
          }
          return [...prevMessages.slice(0, -1), lastMessage];
        } else {
          // If no humanSender message exists, create a new one
          return [
            ...prevMessages,
            {
              senderType: "humanSender",
              message: newMessage,
              isEdit: false,
            },
          ];
        }
      });
      scrollToBottom(); // Scroll to the bottom after updating the messages
    }
  };

  const saveConversation = async () => {
    if (!proposalId) return;

    setIsConversationSubmit(true);
    try {
      const response = await saveConversationAPI(proposalId);

      if (response && response.status === 'success') {
        setStep2Data(response.data.data); // Store the data in step2Data
        setActiveStep('STEPS2'); // Automatically set Step 2 as active after saving
      }
    } catch (error) {
      console.error("Error while saving conversation:", error);
    } finally {
      setIsConversationSubmit(false);
    }
  };

  const updateResults = useCallback((newResults: string) => {
    setParentResults(newResults);
    scrollToBottom(); // Scroll after updating results
  }, []);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (parentResults) {
      handleParentResults(parentResults);
      setParentResults(null); // Reset parentResults after handling it
    }
  }, [parentResults]); // parentResults as the dependency

  const fetchWalletInfo = async () => {
    try {
      const response = await getWalletInfoAPI(); // Call the wallet info API
      if (response?.status === 'success') {
        const availableTokens = response.data.availableTokens;
        if (availableTokens <= 0) {
          setIsWalletWarningVisible(true); // Show wallet warning if tokens are insufficient
        }
      }
    } catch (error) {
      console.error('Error fetching wallet info:', error);
    }
  };

  const fetchProjectConversation = async (proposalId: string) => {
    setIsLoading(true); // Start loading
    try {
      const response = await getConversation(proposalId);
      if (response?.status === 'success') {
        const transformedMessages = response.data.data.map((message: any) => {
          const key = Object.keys(message)[0];
          const value = message[key];
          return {
            senderType: key === "SalesRep" ? "AISender" : "humanSender",
            message: value,
            isEdit: false,
          };
        });
        setMessages(transformedMessages);
      } else {
        setDefaultMessage();
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false); // Stop loading after fetching data
      scrollToBottom();
    }
  };

  // Fetch project details when component mounts
  useEffect(() => {
    const proposalId = localStorage.getItem("proposal_id");
    setProposalId(proposalId);

    // Fetch wallet info first
    fetchWalletInfo();

    if (!proposalId) {
      setDefaultMessage();
      return;
    }

    fetchProjectConversation(proposalId);
  }, []);

  const handleApiError = (error: any) => {
    console.error("API Error:", error);
    setDefaultMessage();
  };


  const generateConversation = async () => {
    setisLoadingProcess(true);
    let payload = {
      proposal_id: proposalId ? proposalId : "",
      data: messages[messages.length - 1].isEdit
        ? messages[messages.length - 1].message.toString()
        : parentResults,
    };

    let clonedMessages = [...messages];
    clonedMessages[clonedMessages.length - 1].isEdit = false;
    setMessages(clonedMessages);

    try {
      const conversation = await generateConversationAPI(payload);
      if (conversation.status === "success") {
        const conversationData = conversation.data;
        setProposalId(conversationData.proposal_id);
        setItem('proposal_id', conversationData.proposal_id);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            senderType: "AISender",
            message: conversationData.data,
            isEdit: false,
          },
        ]);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            senderType: "humanSender",
            message: "",
            isEdit: true,
          },
        ]);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setresetMessage(false);
      setisLoadingProcess(false);
      setIsBtnProcess(false);
      setIsSpeechModelActive(true);
      scrollToBottom(); // Scroll after receiving AI response
    }
  };

  useEffect(() => {
    if (isBtnProcess) {
      generateConversation();
    }
  }, [isBtnProcess]); // Include generateConversation in the dependency array


  return (
    <div className="requirement-container">
      {isLoading ? (
        <div className="loading-overlay" id="loadingOverlay">
          <div className="spinner-ldr">
            <img src={spinner} alt="Loading..." />
          </div>
        </div>
      ) : (
        <>
          {isWalletWarningVisible ? (
            <WalletTokenWarning /> // Show wallet warning if tokens are insufficient
          ) : (
            <div className="conversation-content">
              <div className="title-img">
                <Title title="Project Conversation" />
                <img src={volume} alt="volume Icon" width={24} />
              </div>

              <div className="message-content">
                {messages.map((msg, index) => (
                  <Messages
                    key={index}
                    senderType={msg.senderType}
                    setMessages={setMessages}
                    isEdits={msg.isEdit}
                    messageState={messages}
                    message={msg.message}
                  />
                ))}
                {isLoadingProcess && (
                  <div className="wave-loading">
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                  </div>
                )}
                {isSpeechModelActive && (
                  <div className='conversation-microphone'>
                    <SpeechToText
                      updateResults={updateResults}
                      setBtnProcess={setIsBtnProcess}
                      isplay={isplay}
                      setresetMessage={resetMessage}
                      setIsplay={setIsplay}
                      setIsRecording={setIsRecording}
                      isLoadingProcess={isLoadingProcess}
                    />
                  </div>
                )}
                <div ref={messageEndRef}></div>
              </div>
            </div>
          )}
        </>
      )}

      {showMicPopup && (
        <InfoPopup
          message="Click on the Microphone Icon to start the conversation."
          icon={<MicrophoneIcon color="red" />} // Pass the icon
          onClose={() => setShowMicPopup(false)} // Close popup after countdown
        />
      )}


      <div className="buttons">
        {messages.length > 1 && (
          <button
            onClick={saveConversation}
            className={isConversationSubmit ? "btn" : "btn btn-primary"}
          >
            {isConversationSubmit ? (
              <img src={spinner} alt="spinner Icon" width={24} />
            ) : (
              "Submit"
            )}
          </button>
        )}
        {!isSpeechModelActive && (
          <button
            onClick={handleMicClick}
            className="btn btn-primary getStartedBtn"
          >
            <MicrophoneIcon /> Let Me Tell You
          </button>
        )}
      </div>
    </div>
  );
};

export default Step1;
