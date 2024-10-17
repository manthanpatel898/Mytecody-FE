import React, { useState } from 'react';
import './EditStoryModal.scss'; // Include your SCSS
import Input from '../../../../components/Input/Input';
import Textarea from '../../../../components/Textarea/Textarea';
import Button from '../../../../components/Button/Button';
import spinner from '../../../../assets/spinner.svg'; // Assuming you have a spinner icon in your assets
import { DeleteIcon } from '../../../../assets/delete_icon';
import { AddnewIcon } from '../../../../assets/addnew_icon';
import { updateStorieAPI } from '../../../../service/Proposal.service';

interface EditStoryModalProps {
  closeModal: () => void;
  story: any; // Story data passed as a prop
  epicId: string;
  refreshEpics: () => void;
  proposalId: string;
  stakeholder: string;
}

const EditStoryModal= ({ closeModal, story, epicId, refreshEpics, proposalId, stakeholder }:any) => {
  const [title, setTitle] = useState(story.title || '');
  const [description, setDescription] = useState(story.description || '');
  const [acceptanceCriteria, setAcceptanceCriteria] = useState<string[]>(story.acceptance_criteria || ['']);
  const [errors, setErrors] = useState({ title: '', description: '', acceptanceCriteria: '' });
  const [loading, setLoading] = useState(false); // State to handle loading

  // Function to handle form submission
  const handleSubmit = async () => {
    const newErrors = { title: '', description: '', acceptanceCriteria: '' };

    if (!title) newErrors.title = 'Title is required';
    if (!description) newErrors.description = 'Description is required';
    if (acceptanceCriteria.some(ac => !ac.trim())) newErrors.acceptanceCriteria = 'At least one acceptance criteria is required';

    setErrors(newErrors);
    if (newErrors.title || newErrors.description || newErrors.acceptanceCriteria) return; // Return if there are errors

    setLoading(true); // Start loading

    const payload = {
      proposal_id: proposalId,
      stakeholder,
      epic_id: epicId,
      story_id: story.id, // Pass the story ID
      title,
      description,
      acceptance_criteria: acceptanceCriteria
    };

    try {
      const response = await updateStorieAPI(payload); // Call the API for editing story
      if (response.status === 'success') {
        refreshEpics(); // Refresh epics list
        closeModal(); // Close the modal on success
      }
    } catch (error) {
      console.error('Failed to edit story:', error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Handle dynamic addition/removal of acceptance criteria inputs
  const handleAddCriteria = () => {
    setAcceptanceCriteria([...acceptanceCriteria, '']);
  };

  const handleRemoveCriteria = (index: number) => {
    const newCriteria = acceptanceCriteria.filter((_, i) => i !== index);
    setAcceptanceCriteria(newCriteria);
  };

  const handleCriteriaChange = (index: number, value: string) => {
    const newCriteria = acceptanceCriteria.map((ac, i) => (i === index ? value : ac));
    setAcceptanceCriteria(newCriteria);
  };

  return (
    <div className="modal-overlay-edit-storie">
      <div className="modal-content-edit-storie">
        <h2>Edit Story</h2>
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
                  {index > 0 && <DeleteIcon />} {/* Show delete icon except for the first input */}
                </span>
              </div>
            ))}
            <div className="add-criteria-icon" onClick={handleAddCriteria}>
              <AddnewIcon /> {/* Assuming AddnewIcon is an SVG or image */}
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

export default EditStoryModal;
