import './Steps.scss'; // Include your SCSS
import React, { useEffect, useState } from 'react';
import Step1 from './Step1/Step1';
import Step2 from './Step2/Step2';
import Step3 from './Step3/Step3';
import Step4 from './Step4/Step4';
import Step5 from './Step5/Step5';
import Step6 from './Step6/Step6';
import Tabs from '../../components/Tabs/Tabs';

const Steps = () => {
  const [activeStep, setActiveStep] = useState("STEPS1"); // Step1 is active by default
  const [step2Data, setStep2Data] = useState(null); // Declare step2Data state
  const [step3Data, setStep3Data] = useState(null); // Data for Step 3
  const [step4Data, setStep4Data] = useState(null); // Data for Step 4

  // Function to dynamically set the vh based on the window height
  function setDynamicVh() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }

  useEffect(() => {
    // Call the function initially
    setDynamicVh();
    
    // Call the function on window resize to adjust dynamically
    window.addEventListener('resize', setDynamicVh);
    
    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', setDynamicVh);
    };
  }, []);

  return (
    <div className="steps-wrap">
      {/* Tabs component to navigate between steps */}
      <Tabs activeStep={activeStep} setActiveStep={setActiveStep} />
      <div className="step-content">
        {/* Render Step1 only when activeStep is "STEPS1" */}
        {activeStep === 'STEPS1' && (
          <Step1 setActiveStep={setActiveStep} setStep2Data={setStep2Data} />
        )}

        {/* Render Step2 only when activeStep is "STEPS2" */}
        {activeStep === 'STEPS2' && (
          <Step2
            isActive={activeStep === 'STEPS2'}
            setActiveStep={setActiveStep}
            step2Data={step2Data}
            setStep3Data={setStep3Data} // Pass function to set data for Step 3
          />
        )}

        {/* Render Step3 only when activeStep is "STEPS3" */}
        {activeStep === 'STEPS3' && (
          <Step3
            isActive={activeStep === 'STEPS3'}
            setActiveStep={setActiveStep}
            step3Data={step3Data} // Pass data from Step 2 to Step 3
            setStep4Data={setStep4Data} // Pass function to set data for Step 4
          />
        )}

        {/* Render Step4 only when activeStep is "STEPS4" */}
        {activeStep === 'STEPS4' && (
          <Step4
            isActive={activeStep === 'STEPS4'}
            setActiveStep={setActiveStep}
            step4Data={step4Data} // Pass data from Step 3 to Step 4
          />
        )}

        {/* Render Step5 and Step6 in a similar fashion */}
        {activeStep === 'STEPS5' && <Step5 setActiveStep={setActiveStep} />}
        {activeStep === 'STEPS6' && <Step6 setActiveStep={setActiveStep} />}
      </div>
    </div>
  );
};

export default Steps;
