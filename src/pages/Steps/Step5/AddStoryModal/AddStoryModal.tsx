import React, { useState } from 'react';
import './AddStoryModal.scss'; // Include your SCSS
import Input from '../../../../components/Input/Input';
import Textarea from '../../../../components/Textarea/Textarea';
import Button from '../../../../components/Button/Button';
import spinner from '../../../../assets/spinner.svg'; // Assuming you have a spinner icon in your assets
import { addStorieAPI } from '../../../../service/Proposal.service'; // Import the API
import { DeleteIcon } from '../../../../assets/delete_icon';
import { AddnewIcon } from '../../../../assets/addnew_icon';

interface AddStoryModalProps {
  closeModal: () => void;
  epicId: string;
  refreshEpics: () => void;
  proposalId: string; // Pass the proposalId dynamically
  stakeholder: string; // Pass the stakeholder dynamically
}

const AddStoryModal = ({ closeModal, proposalId, stakeholder, epicId, refreshEpics }: any) => {
    const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [acceptanceCriteria, setAcceptanceCriteria] = useState<string[]>(['']);
  const [errors, setErrors] = useState({ title: '', description: '', acceptanceCriteria: '' });
  const [loading, setLoading] = useState(false); // State to handle loading

  // Handle form submission
  const handleSubmit = async () => {
    const newErrors = { title: '', description: '', acceptanceCriteria: '' };

    // Validate form
    if (!title) newErrors.title = 'Title is required';
    if (!description) newErrors.description = 'Description is required';
    if (acceptanceCriteria.some(ac => !ac.trim())) newErrors.acceptanceCriteria = 'At least one acceptance criterion is required';

    setErrors(newErrors);
    if (newErrors.title || newErrors.description || newErrors.acceptanceCriteria) return; // Return if there are errors

    setLoading(true); // Start loading

    // Prepare payload with dynamic values
    const payload = {
      proposal_id: proposalId,
      stakeholder,
      epic_id: epicId,
      title,
      description,
      acceptance_criteria: acceptanceCriteria,
    };

    try {
      const response = await addStorieAPI(payload); // Call the API
      if (response.status === 'success') {
        refreshEpics(); // Refresh epics list
        closeModal(); // Close the modal on success
      }
    } catch (error) {
      console.error('Failed to add story:', error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Handle adding more acceptance criteria input fields
  const handleAddCriteria = () => {
    setAcceptanceCriteria([...acceptanceCriteria, '']); // Add a new empty criteria field
  };

  // Handle removing criteria
  const handleRemoveCriteria = (index: number) => {
    const newCriteria = acceptanceCriteria.filter((_, i) => i !== index);
    setAcceptanceCriteria(newCriteria);
  };

  // Handle changing criteria inputs
  const handleCriteriaChange = (index: number, value: string) => {
    const newCriteria = acceptanceCriteria.map((ac, i) => (i === index ? value : ac));
    setAcceptanceCriteria(newCriteria);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add Story</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          {/* Title Input */}
          <Input
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
          />
          {errors.title && <span className="error">{errors.title}</span>}

          {/* Description Textarea */}
          <Textarea
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {errors.description && <span className="error">{errors.description}</span>}

          {/* Dynamic Acceptance Criteria Inputs */}
          <div className="acceptance-criteria">
            <h4>Acceptance Criteria</h4>
            {acceptanceCriteria.map((criteria, index) => (
              <div key={index} className="criteria-item">
                <Input
                  label={`Criteria ${index + 1}`}
                  value={criteria}
                  onChange={(e) => handleCriteriaChange(index, e.target.value)}
                  type="text"
                />
                <span className="icon" onClick={() => handleRemoveCriteria(index)}>
                  {index > 0 && <DeleteIcon />} {/* Show delete icon only for additional inputs */}
                </span>
              </div>
            ))}
            <div className="add-criteria-icon" onClick={handleAddCriteria}>
              <AddnewIcon /> {/* Add new criteria icon */}
            </div>
            {errors.acceptanceCriteria && <span className="error">{errors.acceptanceCriteria}</span>}
          </div>
        </form>

        {/* Modal Actions */}
        <div className="modal-actions">
          <Button type="button" className="btn btn-secondary" onClick={closeModal}>
            Cancel
          </Button>
          <button className={loading ? "btn" : "btn btn-primary"} disabled={loading} onClick={handleSubmit}>
            {loading ? <img src={spinner} alt="Loading..." width={24} /> : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddStoryModal;
