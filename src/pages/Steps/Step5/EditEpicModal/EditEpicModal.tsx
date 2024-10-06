import React, { useState, useEffect } from 'react';
import './EditEpicModal.scss'; // Add the relevant styles
import { updateEpicAPI } from '../../../../service/Proposal.service'; // Assuming you have an update API
import Input from '../../../../components/Input/Input';
import Textarea from '../../../../components/Textarea/Textarea';
import Button from '../../../../components/Button/Button';
import spinner from '../../../../assets/spinner.svg'; // Assuming you have a spinner icon in your assets

const EditEpicModal = ({ closeModal, proposalId, stakeholder, epic, refreshEpics }: any) => {
  const [title, setTitle] = useState(epic.title || '');
  const [description, setDescription] = useState(epic.description || '');
  const [errors, setErrors] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState(false); // State to handle loading

  useEffect(() => {
    // Pre-fill the data if epic is provided
    if (epic) {
      setTitle(epic.title);
      setDescription(epic.description);
    }
  }, [epic]);

  // Handle form submission
  const handleSubmit = async () => {
    const newErrors = { title: '', description: '' };

    if (!title) {
      newErrors.title = 'Title is required';
    }
    if (!description) {
      newErrors.description = 'Description is required';
    }
    setErrors(newErrors);

    // Return early if there are validation errors
    if (newErrors.title || newErrors.description) {
      return;
    }

    // Start loading
    setLoading(true);

    // Call API to update epic
    const payload = {
      proposal_id: proposalId,
      stakeholder: stakeholder,
      title,
      description,
      id: epic.id // You can pass the ID to update a specific epic
    };

    try {
      const response = await updateEpicAPI(payload);
      if (response.status === 'success') {
        // Close modal and refresh epics on successful submission
        refreshEpics();
        closeModal();
      }
    } catch (error) {
      console.error('Failed to update epic:', error);
    } finally {
      // End loading
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Epic</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <Input
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
          />
          {errors.title && <span className="error">{errors.title}</span>} {/* Error message */}

          <Textarea
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {errors.description && <span className="error">{errors.description}</span>} {/* Error message */}
        </form>

        <div className="modal-actions">
          <Button type="button" className="btn btn-secondary" onClick={closeModal}>
            Cancel
          </Button>

          <button
            className={loading ? "btn" : "btn btn-primary"}
            disabled={loading} // Disable button when loading
            onClick={handleSubmit}
          >
            {loading ? (
              <img src={spinner} alt="Loading..." width={24} />
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditEpicModal;
