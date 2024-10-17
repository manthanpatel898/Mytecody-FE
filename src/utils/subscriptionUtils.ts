import { toast } from "react-toastify";
import { verifySubscriptionAPI } from "../service/subscription.service"; // Adjust the import based on your project structure

/**
 * Checks the subscription status and displays the appropriate message.
 * @param {string} stage - The current stage or subscription plan to check.
 * @param {string} requiredPlan - The required subscription plan for the stage.
 * @param {(show: boolean) => void} setShowSubscriptionPopup - Function to toggle the subscription popup visibility.
 * @returns {Promise<boolean>} - Returns `true` if the subscription is valid, `false` otherwise.
 */
export const checkSubscriptionStatus = async (
  stage: string,
  requiredPlan: string,
  setShowSubscriptionPopup: (show: boolean) => void
): Promise<boolean> => {
  try {
    const res = await verifySubscriptionAPI();
    const isSubscribed =
      res?.data?.status === "active" || res?.data?.status === "trialing";
    const productName = res?.data?.product_name;

    if (!isSubscribed) {
      toast.error("Please subscribe to the product");
      setShowSubscriptionPopup(true);
      return false;
    }

    if (stage === requiredPlan && productName !== requiredPlan) {
      toast.error("You are not subscribed to the required plan.");
      setShowSubscriptionPopup(true);
      return false;
    }

    setShowSubscriptionPopup(false); // Ensure the pop-up is hidden if user has valid subscription
    return true;
  } catch (err) {
    console.error("Error verifying subscription status:", err);
    toast.error("Failed to verify subscription status");
    setShowSubscriptionPopup(true); // Show the pop-up in case of an API failure
    return false;
  }
};