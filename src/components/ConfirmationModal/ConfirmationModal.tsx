import React from 'react';
import './ConfirmationModal.scss'; // Add the relevant styles
import Button from '../Button/Button';
import spinner from '../../assets/spinner.svg'; // Assuming you have a spinner icon in your assets

interface ConfirmationModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean; // Handle loading state for the confirm button
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  title,
  message,
  onConfirm,
  onCancel,
  isLoading,
}) => {
  return (
    <div className="modal-overlay-delete">
      <div className="modal-content-delete">
        <h2>{title}</h2>
        <p>{message}</p>

        <div className="modal-actions">
          <Button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </Button>

          <button
            className={isLoading ? 'btn' : 'btn btn-primary'}
            disabled={isLoading} // Disable button when loading
            onClick={onConfirm}
          >
            {isLoading ? (
              <img src={spinner} alt="Loading..." width={24} />
            ) : (
              'Confirm'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
