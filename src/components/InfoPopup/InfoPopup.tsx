import React, { useEffect, useState } from "react";
import "./InfoPopup.scss"; // Add your styles

interface InfoPopupProps {
  message: string;
  icon: React.ReactNode; // Use ReactNode to allow any type of icon
  onClose: () => void;   // Callback to close the popup after the countdown
}

const InfoPopup: React.FC<InfoPopupProps> = ({ message, icon, onClose }) => {
  const [counter, setCounter] = useState(5); // Start from 5

  useEffect(() => {
    // Countdown logic
    const timer = setInterval(() => {
      setCounter((prevCounter) => prevCounter - 1);
    }, 1000);

    // Close the pop-up after 5 seconds
    if (counter === 0) {
      onClose();
    }

    return () => {
      clearInterval(timer); // Cleanup the timer on component unmount
    };
  }, [counter, onClose]);

  return (
    <div className="info-popup">
      <div className="info-popup-content">
        <div className="icon">{icon}</div>
        <div className="message">{message}</div>
        <div className="countdown">Close in {counter} ...</div>
      </div>
    </div>
  );
};

export default InfoPopup;