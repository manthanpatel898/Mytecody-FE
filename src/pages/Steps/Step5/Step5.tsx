import './Step5.scss'; // Include your SCSS
import Title from '../../../components/Title/Title';
import { useEffect, useRef, useState } from 'react';
import spinner from '../../../assets/spinner.svg';
import { LoaderIcon } from '../../../assets/loader_icon';
import { generateEpicsAPI, getAllEpicsApi, getStackholderAPI, getEpicsFromStackholderAPI, deleteEpicAPI, generateStoriesAPI, generateTasksAPI } from '../../../service/Proposal.service'; // Import the APIs
import { EditIcon } from '../../../assets/edit_icon';
import { DeleteIcon } from '../../../assets/delete_icon';
import { AddnewIcon } from '../../../assets/addnew_icon';
import AddEpicModal from './AddEpicModal/AddEpicModal';
import EditEpicModal from './EditEpicModal/EditEpicModal';
import ConfirmationModal from '../../../components/ConfirmationModal/ConfirmationModal';
import LoadingModal from '../../../components/LoadingModal/LoadingModal';
import AddStoryModal from './AddStoryModal/AddStoryModal';
import EditStoryModal from './EditStoryModal/EditStoryModal';
import AddTaskModal from './AddTaskModal/AddTaskModal';
import UpdateTaskModal from './UpdateTaskModal/UpdateTaskModal';
import { getWalletInfoAPI } from '../../../service/Wallet.service';
import WalletTokenWarning from '../../../components/WalletTokenWarning/WalletTokenWarning';
interface Epic {
  id: string;
  title: string;
  description: string;
  user_stories?: Story[];
  epic_id: string // Optional, since some epics may not have stories yet
}

interface Story {
  id: string;
  title: string;
  description: string;
  acceptance_criteria: string[];
  tasks?: Task[]; // Add this optional tasks array
}

interface Task {
  id: string;
  description: string;
  complexity: string;
}

const Step5 = ({ isActive, setActiveStep }: any) => {
  const [isLoading, setIsLoading] = useState(true); // Loader until content loads
  const [epicsLoading, setEpicsLoading] = useState(false); // Loader for epics fetching
  const [proposalId, setProposalId] = useState<string | null>(null);
  const [epicsData, setEpicsData] = useState<Epic[]>([]); // Default to an empty array, not null
  const [stackholderData, setStackholderData] = useState([]); // State to store stackholder data
  const [stackholderIndex, setStakeholderIndex] = useState<number>(0); // Default stackholderIndex is set to 0
  const [expandedEpicIndex, setExpandedEpicIndex] = useState<number | null>(null); // Track which epic is expanded
  const [selectedEpic, setSelectedEpic] = useState<Epic | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [expandedStoryIndex, setExpandedStoryIndex] = useState<number | null>(null);
  const [isGeneratingStories, setIsGeneratingStories] = useState(false); // New state for modal
  const [isGeneratingTasks, setIsGeneratingTasks] = useState(false); // New state for modal
  const [isAddStoryModalOpen, setIsAddStoryModalOpen] = useState(false);
  const [isEditStoryModalOpen, setIsEditStoryModalOpen] = useState(false); // For managing the story modal
  const [selectedStory, setSelectedStory] = useState<any | null>(null); // For storing the selected story details
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false); // For managing the story modal
  const [selectedTask, setSelectedTask] = useState(false); // For managing the story modal
  const [isWalletWarningVisible, setIsWalletWarningVisible] = useState(false); // Show pop-up for insufficient tokens
  // Ensure proposalId is a string, fallback to empty string if null
  const proposalIdString = proposalId ?? '';

  // Ensure epicId is a string, fallback to empty string if selectedEpic is null
  const epicId = selectedEpic?.id ?? '';

  const messageEndRef = useRef<HTMLDivElement>(null);

  // Scroll to the bottom of the message container
  const scrollToBottom = () => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Fetch epics data when the component becomes active
  const getAllEpics = async (proposalId: string) => {
    try {
      const response = await getAllEpicsApi(proposalId); // Call API to fetch epics data

      if (response?.status === 'success') {
        if (response.data.epicsIsPresent) {
          // Call getStackholderAPI when epics are present
          await fetchStackholderData(proposalId);
        } else {
          // Call generateEpicsAPI when epics are not present
          await generateEpics(proposalId);
        }
      } else {
        console.log('Failed to fetch epics. Applying fallback logic.');
      }
    } catch (error) {
      console.error("Error fetching epics data:", error);
    }
  };

  // Fetch Stackholder Data
  const fetchStackholderData = async (proposalId: string) => {
    try {
      const response = await getStackholderAPI(proposalId); // Call API to get stackholder data

      if (response?.status === 'success') {
        setStackholderData(response.data.stake_holders); // Store stackholder data
        setStakeholderIndex(0); // Default to first stakeholder
        await fetchEpicsFromStackholder(proposalId, response.data.stake_holders[0]); // Fetch epics for the first stackholder
      } else {
        console.log('Failed to fetch stackholders.');
      }
    } catch (error) {
      console.error("Error fetching stackholder data:", error);
    } finally {
      setIsLoading(false); // Stop the loader once data is loaded
    }
  };

  // Fetch Epics based on selected stackholder
  const fetchEpicsFromStackholder = async (proposalId: string, stackholder: string) => {
    setEpicsLoading(true); // Start loading for epics section
    try {
      const response = await getEpicsFromStackholderAPI(proposalId, stackholder); // Call API to get epics from stackholder

      if (response?.status === 'success') {
        setEpicsData(response.data.epics); // Store epics data
      } else {
        // setEpicsData([]); // No epics found for this stackholder
      }
    } catch (error) {
      console.error("Error fetching epics for stackholder:", error);
    } finally {
      setEpicsLoading(false); // Stop the loader for epics once data is loaded
    }
  };

  // Generate Epics
  const generateEpics = async (proposalId: string) => {
    try {
      const response = await generateEpicsAPI(proposalId); // Call API to generate epics

      if (response?.status === 'success') {
        console.log('Epics generated successfully');
        refreshEpics();
      } else {
        console.log('Failed to generate epics.');
      }
    } catch (error) {
      console.error("Error generating epics:", error);
    } finally {
      setIsLoading(false); // Stop the loader once data is loaded
    }
  };

  // Function to handle click on a stakeholder
  const setIndex = (index: number) => {
    setStakeholderIndex(index); // Set active stakeholder
    fetchEpicsFromStackholder(proposalId as string, stackholderData[index]); // Fetch epics for the selected stackholder
  };

  // Toggle epic expansion
  const toggleEpicExpansion = (index: number) => {
    setExpandedEpicIndex(expandedEpicIndex === index ? null : index); // Expand or collapse the clicked epic
  };

  // Function to handle the add epic button
  const handleAddEpic = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleDeleteEpic = (epic: any) => {
    setSelectedEpic(epic); // Set the selected epic data
    setIsDeleteModalOpen(true); // Open the delete modal
  };

  // Function to handle edit button click
  const handleEditEpic = (epic: any) => {
    setSelectedEpic(epic); // Set the selected epic data
    setIsEditModalOpen(true); // Open the edit modal
  };


  // Function to refresh epics after adding a new one
  const refreshEpics = async () => {
    if (proposalId && stackholderData.length > 0) {
      await fetchEpicsFromStackholder(proposalId, stackholderData[stackholderIndex]); // Fetch epics for the selected stackholder
    }

    // Logic to refresh the epics list after adding a new epic
  };

  // Function to toggle story expansion
  const toggleStoryExpansion = (storyIndex: number) => {
    setExpandedStoryIndex(expandedStoryIndex === storyIndex ? null : storyIndex);
  };


  const confirmDelete = async () => {
    setLoadingDelete(true);
    const payload = {
      proposal_id: proposalId, // dynamic proposal id
      stakeholder: stackholderData[stackholderIndex], // dynamic stakeholder
      id: selectedEpic!.id // ID of the epic to be deleted
    };

    try {
      const response = await deleteEpicAPI(payload);
      if (response.status === 'success') {
        // Handle success (refresh epics, close modal, etc.)
        refreshEpics(); // refresh the epic list
        setIsDeleteModalOpen(false);
      }
    } catch (error) {
      console.error('Failed to delete epic:', error);
    } finally {
      setLoadingDelete(false);
    }
  };

  // Generate Stories
  const generateStories = async () => {
    setIsGeneratingStories(true); // Show the modal
    try {
      const response = await generateStoriesAPI(proposalId);
      if (response?.status === 'success') {
        // Close modal and refresh epics
        refreshEpics();
      }
    } catch (error) {
      console.error("Error generating stories:", error);
    } finally {
      setIsGeneratingStories(false); // Hide the modal
    }
  };

  // Generate Tasks
  const generateTasks = async () => {
    setIsGeneratingTasks(true); // Show the modal
    try {
      const response = await generateTasksAPI(proposalId); // Call the generateTasks API
      if (response?.status === 'success') {
        // Close modal and refresh epics
        refreshEpics();
      }
    } catch (error) {
      console.error("Error generating tasks:", error);
    } finally {
      setIsGeneratingTasks(false); // Hide the modal
    }
  };

  const handleAddStory = (epic: any) => {
    setSelectedEpic(epic);
    setIsAddStoryModalOpen(true);

  }
  const handleEditStory = (story: any, epic: any) => {
    setSelectedEpic(epic);
    setSelectedStory(story); // Set the selected story to be edited
    setIsEditStoryModalOpen(true); // Open the edit story modal
  };
  // Function to handle adding a task
  const handleAddTask = (epic: any, story: any) => {
    setSelectedEpic(epic);
    setSelectedStory(story); // Set the selected story to be edited
    setIsAddTaskModalOpen(true);
  };

  // Close modal
  const closeAddTaskModal = () => {
    setIsAddTaskModalOpen(false);
  };


  const handleDeleteStory = (storie: any) => {

  }

  const handleEditTask = (task: any, story: any, epic: any) => {
    setSelectedTask(task); // Set the selected task for editing
    setSelectedStory(story); // Set the story associated with the task
    setSelectedEpic(epic); // Set the epic associated with the task
    setIsEditTaskModalOpen(true); // Open the edit task modal
  };


  const handleDeleteTask = (task: any) => {

  }

  // Fetch wallet info and check if tokens are available
  const fetchWalletInfo = async () => {
    try {
      const response = await getWalletInfoAPI();
      if (response?.status === 'success') {
        const availableTokens = response.data.availableTokens;
        if (availableTokens <= 0) {
          setIsWalletWarningVisible(true); // Show wallet warning if tokens are insufficient
          return; // Do not proceed further if tokens are insufficient
        }
      }
    } catch (error) {
      console.error('Error fetching wallet info:', error);
    }
  };


  // Fetch project details and set epicsData when the component becomes active
  useEffect(() => {
    const storedProposalId = localStorage.getItem("proposal_id");
    setProposalId(storedProposalId);
    fetchWalletInfo(); // Fetch wallet info before any further actions
    if (storedProposalId && !isWalletWarningVisible) {
      getAllEpics(storedProposalId); // Fetch epics when proposalId is available
    }
  }, [isActive, isWalletWarningVisible]); // Run when the component becomes active

  return (
    <div className="epics-container">
      {isLoading ? (
        <div className="spinner-ldr">
          <img src={spinner} alt="Loading..." />
        </div>
      ) : isWalletWarningVisible ? (
        <WalletTokenWarning /> // Show Wallet Token Warning pop-up if tokens are insufficient
      ) : (

        <div className="epics-details-content">
          <div className="title-img">
            <Title title="Epics of the Project" />
          </div>

          {/* Render Stackholder Data */}
          <div className="stackholder-content">
            <div className="step-inner-wrap">
              <ul>
                {stackholderData.length > 0 ? (
                  stackholderData.map((item: any, index: number) => (
                    <li
                      key={item.id}
                      onClick={() => setIndex(index)} // Set active stakeholder on click
                      className={index === stackholderIndex ? "active" : ""} // Highlight the active stakeholder
                    >
                      <LoaderIcon /> {/* Assuming LoaderIcon is an asset */}
                      {item} {/* Display stackholder name */}
                    </li>
                  ))
                ) : (
                  <p>No stackholders available.</p>
                )}
              </ul>
            </div>
          </div>

          {/* Render Epics Data with loader */}
          <div className="epics-list">
            <div className='inner-wrap'>
              <div className='title'>
                <h4>List of Epics</h4>
                <div className="add-icon" onClick={handleAddEpic}>
                  <AddnewIcon /> {/* Assuming AddIcon is an SVG or image */}
                </div>
              </div>

              {epicsLoading ? (
                <div className="spinner-ldr">
                  <img src={spinner} alt="Loading..." />
                </div>
              ) : epicsData.length > 0 ? (
                epicsData.map((epic: any, index: number) => (
                  <div key={epic.id} className="epic-item">
                    <div className="epic-header" onClick={() => toggleEpicExpansion(index)}>
                      <h3>{epic.title}</h3>
                      <div className="icon-actions">
                        <span onClick={() => handleEditEpic(epic)}>
                          <EditIcon />
                        </span>
                        <span onClick={() => handleDeleteEpic(epic)}>
                          <DeleteIcon />
                        </span>
                      </div>
                    </div>
                    {expandedEpicIndex === index && (
                      <div className="epic-content">
                        <p>{epic.description}</p>
                        <div className="stories-section">
                          <div className="stories-title">
                            <h4>List of Stories</h4>
                            <div className="add-story-icon" onClick={() => handleAddStory(epic)}>
                              <AddnewIcon /> {/* Assuming AddnewIcon is an SVG or image */}
                            </div>
                          </div>

                          {/* Render each story in an accordion */}
                          {epic.user_stories?.map((story: any, storyIndex: number) => (
                            <div key={story.id} className="accordion">
                              <div className="accordion-header" onClick={() => toggleStoryExpansion(storyIndex)}>
                                <h5>{story.title}</h5>
                                <div className="story-actions">
                                  <span onClick={() => handleEditStory(story, epic)}>
                                    <EditIcon />
                                  </span>
                                  <span onClick={() => handleDeleteStory(story)}>
                                    <DeleteIcon />
                                  </span>
                                </div>
                              </div>
                              {expandedStoryIndex === storyIndex && (
                                <div className="accordion-content">
                                  <p>{story.description}</p>
                                  <p>Acceptance Criteria: {story.acceptance_criteria.join(', ')}</p>
                                  {/* Task section */}
                                  {story.tasks?.length > 0 && (
                                    <div className="tasks-section">
                                      <div className="tasks-title">
                                        <h4>List of Tasks</h4>
                                        <div className="add-task-icon" onClick={() => handleAddTask(epic, story)}>
                                          <AddnewIcon /> {/* Assuming AddnewIcon is an SVG or image */}
                                        </div>
                                      </div>
                                      <ul>
                                        {story.tasks.map((task: any) => (
                                          <li key={task.id} className="task-item">
                                            <div className="task-details">
                                              <p>{task.description}</p>
                                              <span className="task-complexity">Complexity: {task.complexity}</span>
                                            </div>
                                            <div className="task-actions">
                                              <span onClick={() => handleEditTask(task, story, epic)}>
                                                <EditIcon />
                                              </span>
                                              <span onClick={() => handleDeleteTask(task)}>
                                                <DeleteIcon />
                                              </span>
                                            </div>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}

                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p>No epics available for this stakeholder.</p>
              )}
            </div>
          </div>

          <div className="buttons">
            {/* Conditionally render the "Generate Stories" button */}
            {epicsData.length > 0 && (!epicsData[0].user_stories || epicsData[0].user_stories.length === 0) && (
              <button className="btn btn-primary" onClick={generateStories}>
                Generate Stories
              </button>
            )}

            {epicsData.length > 0 &&
              epicsData[0] &&
              epicsData[0].user_stories &&
              epicsData[0].user_stories.length > 0 &&
              epicsData[0].user_stories[0] &&
              (!epicsData[0].user_stories[0]?.tasks ||
                epicsData[0].user_stories[0]?.tasks.length === 0) && (
                <button className="btn btn-primary" onClick={generateTasks}>
                  Generate Tasks
                </button>
              )
            }

            <button className="btn btn-primary">
              Submit
            </button>
          </div>
        </div>
      )}

      {/* Conditionally render the Add Epic Modal */}
      {showModal && (
        <AddEpicModal
          closeModal={closeModal}
          proposalId={proposalId} // Dynamic proposal ID
          stakeholder={stackholderData[stackholderIndex]} // Dynamic stakeholder
          refreshEpics={refreshEpics}
        />
      )}

      {isEditModalOpen && (
        <EditEpicModal
          closeModal={() => setIsEditModalOpen(false)}
          proposalId={proposalId}
          stakeholder={stackholderData[stackholderIndex]}
          epic={selectedEpic}
          refreshEpics={refreshEpics}
        />
      )}
      {/* Confirmation Modal for Delete */}
      {isDeleteModalOpen && (
        <ConfirmationModal
          title="Delete Epic"
          message="Are you sure you want to delete this epic?"
          onConfirm={confirmDelete}
          onCancel={() => setIsDeleteModalOpen(false)}
          isLoading={loadingDelete}
        />
      )}
      {/* Modal to show during story generation */}
      {isGeneratingStories && (
        <LoadingModal message="Stories are generating, please keep some patience..." />
      )}

      {isGeneratingTasks && (
        <LoadingModal message="Tasks are generating, please keep some patience..." />
      )}

      {isAddStoryModalOpen && selectedEpic && (
        <AddStoryModal
          closeModal={() => setIsAddStoryModalOpen(false)}
          proposalId={proposalId} // Pass proposalId dynamically
          stakeholder={stackholderData[stackholderIndex]} // Pass stakeholder dynamically
          epicId={selectedEpic.id} // Pass epicId dynamically
          refreshEpics={refreshEpics} // Refresh epics after adding story
        />
      )}

      {isEditStoryModalOpen && selectedStory && (
        <EditStoryModal
          closeModal={() => setIsEditStoryModalOpen(false)}
          story={selectedStory} // Pass the selected story to edit
          proposalId={proposalIdString} // Ensure proposalId is passed as a string
          stakeholder={stackholderData[stackholderIndex]} // Pass stakeholder dynamically
          epicId={selectedEpic?.id} // Pass epicId dynamically
          refreshEpics={refreshEpics}
        />
      )}

      {isAddTaskModalOpen && selectedEpic && selectedStory && (
        <AddTaskModal
          closeModal={closeAddTaskModal}
          proposalId={proposalId} // Pass dynamic proposal ID
          stakeholder={stackholderData[stackholderIndex]} // Pass dynamic stakeholder
          epicId={selectedEpic?.id} // Pass epic ID
          storyId={selectedStory?.id} // Pass story ID
          refreshEpics={refreshEpics} // Function to refresh the epic list
        />
      )}

      {isEditTaskModalOpen && selectedEpic && selectedStory && selectedTask && (
        <UpdateTaskModal
          closeModal={() => setIsEditTaskModalOpen(false)}
          proposalId={proposalId}
          stakeholder={stackholderData[stackholderIndex]} // Dynamic stakeholder
          epicId={selectedEpic.id}
          storyId={selectedStory.id}
          task={selectedTask}
          refreshEpics={refreshEpics}
        />
      )}

    </div >
  );
};

export default Step5;
