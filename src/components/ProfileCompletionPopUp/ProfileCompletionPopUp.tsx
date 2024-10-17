import React from 'react';
import './ProfileCompletionPopUp.scss'; // Add your styling for the pop-up

interface ProfileCompletionPopUpProps {
  show: boolean;
  onClose: () => void;
  onMyProfile: () => void;
}

const ProfileCompletionPopUp: React.FC<ProfileCompletionPopUpProps> = ({ show, onClose, onMyProfile }) => {
  if (!show) return null;

  return (
    <div className="profile-popup-overlay">
      <div className="profile-popup-container">
        <h3>Please complete the profile first before sending the proposal.</h3>
        <div className="popup-buttons">
          <button className="btn btn-secondary" onClick={onClose}>Skip</button>
          <button className="btn btn-primary" onClick={onMyProfile}>My Profile</button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletionPopUp;