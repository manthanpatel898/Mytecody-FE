// InfoSection.tsx
import React from 'react';
import './ModalInfo.scss'; // Import SCSS for styling, if necessary

const ModalInfo: React.FC = () => {
  return (
    <div className="info-section">
      <div className="title">Make a Proposal Using AI</div>
      <ul className="benefits">
        <p>🚀 Streamline your Estimating Process with our Human-In-The-Loop AI System.</p>
        <p>🧠 From Idea to Personalized Proposal and Detailed Project Breakdown report in less than 1 hour.</p>
      </ul>

      {/* Person Section */}
      <div className="person-section">
        <div className="person">
          <div className="image">
            <img src="path-to-image1.jpg" alt="Waleed Lozano" />
          </div>
          <div className="info">
            <div className="name">Waleed Lozano</div>
            <div className="title">Product Designer</div>
          </div>
        </div>

        <div className="person">
          <div className="image">
            <img src="path-to-image2.jpg" alt="Jane Doe" />
          </div>
          <div className="info">
            <div className="name">Jane Doe</div>
            <div className="title">Project Manager</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalInfo;
