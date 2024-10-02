import './Step6.scss'; // Include your SCSS

const Step6 = ({ setActiveStep }:any) => {
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

export default Step6;
