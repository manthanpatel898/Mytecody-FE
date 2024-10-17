import React, { useState } from 'react';
import './AddTaskModal.scss'; // Include your SCSS file
import Button from '../../../../components/Button/Button';
import { addTaskAPI } from '../../../../service/Proposal.service'; // Import your API
import spinner from '../../../../assets/spinner.svg'; // Assuming you have a spinner icon in your assets
import Textarea from '../../../../components/Textarea/Textarea';

const AddTaskModal = ({ closeModal, proposalId, stakeholder, epicId, storyId, refreshEpics }:any) => {
  const [description, setDescription] = useState('');
  const [complexity, setComplexity] = useState('');
  const [errors, setErrors] = useState({ description: '', complexity: '' });
  const [loading, setLoading] = useState(false);

  const complexities = ['Very_Simple', 'Simple', 'Medium', 'Complex', 'Very_Complex'];

  // Function to handle form submission
  const handleSubmit = async () => {
    const newErrors = { description: '', complexity: '' };

    if (!description) newErrors.description = 'Description is required';
    if (!complexity) newErrors.complexity = 'Complexity is required';

    setErrors(newErrors);
    if (newErrors.description || newErrors.complexity) return;

    setLoading(true); // Start loading

    const payload = {
      proposal_id: proposalId,
      stakeholder,
      epic_id: epicId,
      story_id: storyId,
      description,
      complexity
    };

    try {
      const response = await addTaskAPI(payload);
      if (response.status === 'success') {
        refreshEpics(); // Refresh the list of epics to include the new task
        closeModal(); // Close the modal after success
      }
    } catch (error) {
      console.error('Failed to add task:', error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="modal-overlay-add-task">
      <div className="modal-content-add-task">
        <h2>Add Task</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          {/* Description Input */}
          <Textarea
            label="Task Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {errors.description && <span className="error">{errors.description}</span>}

          {/* Complexity Dropdown */}
          <div className="input-container">
            <select value={complexity} onChange={(e) => setComplexity(e.target.value)}>
              <option value="">Select Complexity</option>
              {complexities.map((level) => (
                <option key={level} value={level}>
                  {level.replace('_', ' ')}
                </option>
              ))}
            </select>
            {errors.complexity && <span className="error">{errors.complexity}</span>}
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

export default AddTaskModal;
