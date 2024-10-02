import './Step1.scss'; // Include your SCSS
import Title from '../../../components/Title/Title';
import volume from "../../../assets/volume.svg";
import { useCallback, useEffect, useRef, useState } from 'react';
import Message from '../../../components/message/Message';
import { getConversation, getProjectVision } from '../../../service/Proposal.service';
import { toast } from 'react-toastify';
import spinner from '../../../assets/spinner.svg';
import { MicrophoneIcon } from "../../../assets/microphone_icon";
import SpeechToText from '../../../components/SpeechToText/SpeechToText';

interface Message {
  senderType: string;
  message: string;
  isEdit?: boolean;
}

const Step1 = ({ setActiveStep }: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [proposalId, setProposalId] = useState<string | null>(null);
  const [isVisionAvailable, setIsVisionAvailable] = useState(false);
  const [isSpeechModelActive, setIsSpeechModelActive] = useState(false);
  const [isBtnSubmit, setIsBtnSubmit] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const [isLoadingProcess, setisLoadingProcess] = useState(false);
  const [parentResults, setParentResults] = useState<string | null>(null); // Changed to string | null
  const [isplay, setIsplay] = useState(false);
  const [resetMessage, setresetMessage] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isConversationSubmit, setIsConversationSubmit] = useState(false)
  // Proceed to the next step
  const handleNext = () => {
    setActiveStep('STEPS2');
  };

  // Default message if no proposal or conversation is found
  const setDefaultMessage = () => {
    setMessages([
      {
        senderType: "AISender",
        message: "Please provide insights into your project requirements, allowing me to gain a comprehensive understanding. Share details about your business needs and articulate the specific goals of the software or solution you seek.",
        isEdit: false,
      },
    ]);
  };

  // Handle API errors and display default message
  const handleApiError = (error: any) => {
    console.error("API Error:", error);
    setDefaultMessage();
    toast.error("Oops! Something went wrong", { position: "bottom-right" });
  };

  // Fetch project vision details
  const fetchProjectVision = async (proposalId: string) => {
    setIsLoading(true);
    try {
      const response = await getProjectVision(proposalId);
      if (response?.status === 'success') {
        setMessages([
          {
            senderType: "DefaultSender",
            message: response.project_vision,
            isEdit: false,
          },
        ]);
        setIsVisionAvailable(true);
      } else {
        await fetchProjectConversation(proposalId); // Fetch conversation if no vision
        setIsVisionAvailable(false);
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch project conversation details
  const fetchProjectConversation = async (proposalId: string) => {
    setIsLoading(true);
    try {
      const response = await getConversation(proposalId);
      if (response?.status === 'success') {
        const transformedMessages = response.data.map((message: any) => {
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
      setIsLoading(false);
    }
  };

  // Fetch proposal details on component mount
  useEffect(() => {
    const proposalId = localStorage.getItem("proposal_id");
    setProposalId(proposalId);

    if (!proposalId) {
      setDefaultMessage();
      return;
    }

    fetchProjectVision(proposalId);
  }, []);

  // Handle microphone button click
  const handleMicClick = () => {
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
    }
  };


  const scrollToBottom = () => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const updateResults = useCallback((newResults: string) => {
    setParentResults(newResults);
    scrollToBottom();
  }, []);

  useEffect(() => {
    if (parentResults) {
      handleParentResults(parentResults);
      setParentResults(null); // Reset parentResults after handling it
    }
  }, [parentResults]); // parentResults as the dependency

  const saveConversation = () => {

  }

  return (
    <div className="requirement-container">
      <div className="conversation-content">
        <div className="title-img">
          <Title title="Project Vision" />
          <img src={volume} alt="volume Icon" width={24} />
        </div>

        <div className="message-content">
          {messages.map((msg, index) => (
            <Message
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
          <div ref={messageEndRef}></div>
        </div>
      </div>

      {isSpeechModelActive && (
        <div className='conversation-microphone'>
          <SpeechToText
            updateResults={updateResults}
            setBtnSubmit={setIsBtnSubmit}
            isplay={isplay}
            setresetMessage={resetMessage}
            setIsplay={setIsplay}
            setIsRecording={setIsRecording}
            isLoadingProcess={isLoadingProcess}
          />
        </div>
      )}

      {isLoading && (
        <div className="spinner-ldr">
          <img src={spinner} alt="Loading..." />
        </div>
      )}

      <div className="conversation-button">
        {!isVisionAvailable && messages.length > 1 && (
          <button
            onClick={() => {
              saveConversation();
            }}
            className={isConversationSubmit ? "btn" : "btn btn-primary"}
          >
            {isConversationSubmit ? (
              <img src={spinner} alt="spinner Icon" width={24} />
            ) : (
              "Submit"
            )}
          </button>
        )}
        {!isSpeechModelActive && !isVisionAvailable && (
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
