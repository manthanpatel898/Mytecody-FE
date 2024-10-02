import './Steps.scss'; // Include your SCSS
import React, { useEffect, useState } from 'react';
import Step1 from './Step1/Step1';
import Step2 from './Step2/Step2';
import Step3 from './Step3/Step3';
import Step4 from './Step4/Step4';
import Step5 from './Step5/Step5';
import Step6 from './Step6/Step6';
import Tabs from '../../components/Tabs/Tabs';
// import Step1 from './Step1';
// import Step2 from './Step2';
// import Step3 from './Step3';
// import Step4 from './Step4';
// import Step5 from './Step5';
// import Step6 from './Step6';


const Steps = () => {
  const [activeStep, setActiveStep] = useState("STEPS1");

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
      <Tabs activeStep={activeStep} setActiveStep={setActiveStep} />
      <div className="step-content">
        {activeStep === 'STEPS1' && <Step1 setActiveStep={setActiveStep} />}
        {activeStep === 'STEPS2' && <Step2 setActiveStep={setActiveStep} />}
        {activeStep === 'STEPS3' && <Step3 setActiveStep={setActiveStep} />}
        {activeStep === 'STEPS4' && <Step4 setActiveStep={setActiveStep} />}
        {activeStep === 'STEPS5' && <Step5 setActiveStep={setActiveStep} />}
        {activeStep === 'STEPS6' && <Step6 setActiveStep={setActiveStep} />}
      </div>
    </div>
  );
};

export default Steps;
