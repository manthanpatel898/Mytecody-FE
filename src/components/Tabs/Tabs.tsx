import { useEffect, useState } from "react";
import "./Tabs.scss";
import { useNavigate, useLocation } from "react-router"; // Import useLocation
// import { verifySubscription } from "../../api-config/services/Subscription.service";
import { toast } from "react-toastify";
// import SubscriptionPopUp from "../../pages/subscriptionPopUp/subscriptionpopup";
// import { SUBSCRIPTION_PLAN_1 } from "../../core/constants/constants";

const tabSteps = [
  { step: "STEPS1", label: "Steps 1" },
  { step: "STEPS2", label: "Steps 2" },
  { step: "STEPS3", label: "Steps 3" },
  { step: "STEPS4", label: "Steps 4" },
  { step: "STEPS5", label: "Steps 5" },
  { step: "STEPS6", label: "Steps 6" },
];

const Tabs = ({ activeStep, setActiveStep }: any) => {
  const navigate = useNavigate();
  const location = useLocation(); // Get current location
  const [showModal, setShowModal] = useState(false);

  // Function to check subscription status
//   const checkSubscriptionStatus = async (stage: string) => {
//     try {
//       const res = await verifySubscription();
//       const isSubscribed =
//         res?.data?.status === "active" || res?.data?.status === "trialing";
//       const productName = res?.data?.product_name;

//       if (!isSubscribed) {
//         toast.error("Please subscribe to the product");
//         setShowModal(true);
//         return false;
//       }

//       if (stage === SUBSCRIPTION_PLAN_1 && productName !== SUBSCRIPTION_PLAN_1) {
//         toast.error("Not allowed to generate proposal");
//         setShowModal(true);
//         return false;
//       }

//       return true;
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to verify subscription status");
//       return false;
//     }
//   };

  // Handle tab clicks
  const handleTabClick = async (data: any) => {
    // const isEligible = await checkSubscriptionStatus(data.stage);
    // if (isEligible) {
      setActiveStep(data.step);
      navigate(`/${data.step.toLowerCase()}`);
    // }
  };

  // Effect to handle active step on location change
  useEffect(() => {
    const stepNumber = location.pathname.split("/").pop() || "steps1";
    const checkAndSetActiveStep = async () => {
      if (stepNumber.toUpperCase() === "STEPS1") {
        setActiveStep("STEPS1");
        navigate("/steps1");
        return;
      }

    //   const isEligible = await checkSubscriptionStatus(stepNumber.toUpperCase());
    //   if (isEligible) {
        setActiveStep(stepNumber.toUpperCase());
        navigate(`/${stepNumber.toLowerCase()}`);
    //   } else {
        // setActiveStep("STEPS1");
        // navigate("/steps1");
    //   }
    };

    checkAndSetActiveStep();
  }, [location]);  // Runs when location changes

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
      {/* <SubscriptionPopUp
        show={showModal}
        handleClose={() => setShowModal(false)}
      /> */}
    </div>
  );
};

export default Tabs;
