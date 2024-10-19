import { useEffect, useState } from "react";
import "./Tabs.scss";
import { useLocation, useNavigate } from 'react-router-dom';
import { checkSubscriptionStatus } from "../../utils/subscriptionUtils";
import { SUBSCRIPTION_PLAN_1 } from "../../utils/constants";
import SubscriptionPopUp from "../../pages/SubscriptionPopUp/SubscriptionPopUp";

// Tab configuration
const tabSteps = [
  { step: "STEPS1", label: "CONVERSATION", stage: "STAGE-1" },
  { step: "STEPS2", label: "VISION", stage: "STAGE-1" },
  { step: "STEPS3", label: "BUSINESS VERTICAL", stage: SUBSCRIPTION_PLAN_1 },
  { step: "STEPS4", label: "STAKEHOLDER", stage: SUBSCRIPTION_PLAN_1 },
  { step: "STEPS5", label: "EPICS", stage: SUBSCRIPTION_PLAN_1 },
  { step: "STEPS6", label: "PROPOSAL", stage: SUBSCRIPTION_PLAN_1 },
];

const Tabs = ({ activeStep, setActiveStep }: any) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showSubscriptionPopup, setShowSubscriptionPopup] = useState(false);

  // Handle tab clicks
  const handleTabClick = async (data: any) => {
    const isEligible = await checkSubscriptionStatus(data.stage, SUBSCRIPTION_PLAN_1, setShowSubscriptionPopup);
    if (isEligible) {
      setActiveStep(data.step);
      navigate(`/${data.step.toLowerCase()}`);
    }
  };

  // Set the active step based on the URL
  useEffect(() => {
    const stepFromURL = location.pathname.split("/").pop()?.toUpperCase() || "STEPS1";

    const checkAndSetActiveStep = async () => {
      // Allow "STEPS1" and "STEPS2" without subscription check
      if (stepFromURL === "STEPS1" || stepFromURL === "STEPS2") {
        setActiveStep(stepFromURL);
        return;
      }

      const isEligible = await checkSubscriptionStatus(stepFromURL, SUBSCRIPTION_PLAN_1, setShowSubscriptionPopup);
      if (isEligible) {
        setActiveStep(stepFromURL);
      } else {
        setActiveStep("STEPS1");
        navigate("/steps1");
      }
    };

    checkAndSetActiveStep();
  }, [location.pathname, navigate, setActiveStep]);

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
      {/* Show subscription popup when needed */}
      <SubscriptionPopUp show={showSubscriptionPopup} handleClose={() => setShowSubscriptionPopup(false)} />
    </div>
  );
};

export default Tabs;