import React from 'react';
import './LoadingModal.scss';

const LoadingModal = ({ message }: { message: string }) => {
  return (
    <div className="loading-modal-overlay">
      <div className="loading-modal-content">
        <p>{message}</p>
      </div>
    </div>
  );
};

export default LoadingModal;
