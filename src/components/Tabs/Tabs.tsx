import { useEffect } from "react";
import "./Tabs.scss";

const tabSteps = [
  { step: "STEPS1", label: "CONVERSATION" },
  { step: "STEPS2", label: "VISION" },
  { step: "STEPS3", label: "BUSINESS VERTICAL" },
  { step: "STEPS4", label: "STACKHOLDER" },
  { step: "STEPS5", label: "REVENUE MODEL" },
  { step: "STEPS6", label: "EPICS" },
];

const Tabs = ({ activeStep, setActiveStep }: any) => {

  // Handle tab clicks
  const handleTabClick = (data: any) => {
    setActiveStep(data.step); // Change the active step
  };

  return (
    <div className="tabWrapper">
      <ul>
        {tabSteps.map((data) => (
          <li
            key={data.step}
            className={data.step === activeStep ? "active steps" : "steps"}
            onClick={() => handleTabClick(data)}
          >
            {data.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tabs;
