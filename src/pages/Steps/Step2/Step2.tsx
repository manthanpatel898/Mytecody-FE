import './Step2.scss'; // Include your SCSS
import Title from '../../../components/Title/Title';
import volume from "../../../assets/volume.svg";
import { useEffect, useRef, useState } from 'react';
import Message from '../../../components/message/Message';
import spinner from '../../../assets/spinner.svg';
import { saveVisionAPI, getProjectVision } from '../../../service/Proposal.service'; // Import saveVisionAPI and getProjectVision

interface Message {
  senderType: string;
  message: string;
  isEdit?: boolean;
}

const Step2 = ({  isActive, setActiveStep, step2Data, setStep3Data  }: any) => { // Receive isActive prop
  const [isLoading, setIsLoading] = useState(true); // Loader until content loads
  const [messages, setMessages] = useState<Message[]>([]);
  const [proposalId, setProposalId] = useState<string | null>(null);
  const [isSubmitVision, setIsSubmitVision] = useState(false); // For disabling button and showing loader
  const messageEndRef = useRef<HTMLDivElement>(null);

  // Scroll to the bottom of the message container
  const scrollToBottom = () => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Save Vision Function
  const saveVision = async () => {
    if (!proposalId) return;

    setIsSubmitVision(true); // Disable button and show loader

    // Create the payload
    const payload = {
      project_vision: messages[messages.length - 1].message, // Get the last message as project vision
      proposal_id: proposalId, // Use the proposalId
    };

    try {
      const response = await saveVisionAPI(payload); // Pass the payload to the API

      if (response && response.status === 'success') {
        setStep3Data(response.data.business_vertical)
        setActiveStep('STEPS3'); // Automatically set Step 3 as active after saving
      }
    } catch (error) {
      console.error("Error while saving vision:", error);
    } finally {
      setIsSubmitVision(false); // Enable button and hide loader after API response
    }
  };

  // Let Me Modify Button Click Function
  const correctbtnClick = () => {
    let clonedMessages = [...messages];
    clonedMessages[clonedMessages.length - 1].isEdit = true; // Set isEdit to true to allow editing
    setMessages(clonedMessages);
  };

  // Fetch project vision if step2Data is not available
  const fetchProjectVision = async (proposalId:string) => {
    try {
      const response = await getProjectVision(proposalId); // Call API to fetch project vision

      if (response?.status === 'success') {
        setMessages([
          {
            senderType: "AISender",
            message: response.data.project_vision, // Set fetched project vision
            isEdit: true, // Initially, editing is not allowed
          },
        ]);
      } else {
        setMessages([
          {
            senderType: "AISender",
            message: "No project vision available.", // Fallback message if no vision
            isEdit: false,
          },
        ]);
      }
    } catch (error) {
      console.error("Error fetching project vision:", error);
    } finally {
      setIsLoading(false); // Stop loader after data is loaded
    }
  };

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch project details and set step2Data into messages when component becomes active
  useEffect(() => {
    const proposalId = localStorage.getItem("proposal_id");
    setProposalId(proposalId);
    debugger
    if (isActive) {
      if (step2Data) {
        // If step2Data is provided, set it to messages
        setMessages([
          {
            senderType: "AISender",
            message: step2Data, // Use step2Data passed from step 1
            isEdit: true, // Initially, editing is not allowed
          },
        ]);
        setIsLoading(false); // Content has loaded, so stop showing loader
      } else if (proposalId) {
        // If step2Data is not available, fetch the project vision
        fetchProjectVision(proposalId);
      }
    }
  }, [isActive, step2Data]); // Run when the component is active

  return (
    <div className="vision-container">
      {isLoading ? ( // Show loader while content is loading
        <div className="spinner-ldr">
          <img src={spinner} alt="Loading..." />
        </div>
      ) : (
        <div className="vision-details-content">
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
          onClick={saveVision}
          className={isSubmitVision ? "btn" : "btn btn-primary"} // Disable button during API call
          disabled={isSubmitVision} // Disable button when loading
        >
          {isSubmitVision ? (
            <img src={spinner} alt="spinner Icon" width={24} />
          ) : (
            "Submit"
          )}
        </button>
      </div>
    </div>
  );
};

export default Step2;
