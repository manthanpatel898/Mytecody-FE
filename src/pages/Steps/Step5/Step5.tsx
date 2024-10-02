import './Step5.scss'; // Include your SCSS
const Step5 = ({ setActiveStep }:any) => {
  const handleNext = () => {
    setActiveStep('STEPS2');
  };

  return (
    <div className="step-container">
      <h2>Step 1</h2>
      <p>This is the content of Step 1.</p>
      <button onClick={handleNext}>Next</button>
    </div>
  );
};

export default Step5;
