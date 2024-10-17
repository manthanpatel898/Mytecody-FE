import React, { useState, useEffect } from 'react';
import './UpdateTaskModal.scss'; // Include your SCSS file
import Textarea from '../../../../components/Textarea/Textarea';
import Button from '../../../../components/Button/Button';
import { updateTaskAPI } from '../../../../service/Proposal.service'; // Import your API
import spinner from '../../../../assets/spinner.svg'; // Assuming you have a spinner icon in your assets

interface UpdateTaskModalProps {
  closeModal: () => void;
  proposalId: string;
  stakeholder: string;
  epicId: string;
  storyId: string;
  task: any; // This should be the task object that you want to update (containing description, complexity, etc.)
  refreshEpics: () => void;
}

const UpdateTaskModal = ({ closeModal, proposalId, stakeholder, epicId, storyId, task, refreshEpics }:any) => {
  const [description, setDescription] = useState(task.description || '');
  const [complexity, setComplexity] = useState(task.complexity || '');
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
      task_id: task.id, // Pass the task ID for updating
      description,
      complexity,
    };

    try {
      const response = await updateTaskAPI(payload);
      if (response.status === 'success') {
        refreshEpics(); // Refresh the list of epics and tasks after successful update
        closeModal(); // Close the modal after success
      }
    } catch (error) {
      console.error('Failed to update task:', error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="modal-overlay-edit-task">
      <div className="modal-content-edit-task">
        <h2>Update Task</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          {/* Description Textarea */}
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
            {loading ? <img src={spinner} alt="Loading..." width={24} /> : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateTaskModal;
