import React, { useEffect, useState } from "react";
import "./SubscriptionPopUp.scss";
import { toast } from "react-toastify";
import spinner from "../../assets/spinner.svg";
import {
  createBillingSessionAPI,
  getCustomerIntentAPI,
  verifySubscriptionAPI,
} from "../../service/subscription.service";

// TypeScript declaration for JSX Stripe element
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "stripe-pricing-table": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}

// Reusable Title component
const Title = ({ isInactive }: { isInactive: boolean }) => (
  <div className="title">{isInactive ? "Payment Details" : "Verified Payment Details"}</div>
);

// Reusable Description component
const Description = ({ isInactive }: { isInactive: boolean }) => (
  <p>{isInactive ? "Please set your payment method" : "Payment method has been verified successfully!"}</p>
);

// Manage subscription button component
const ManageSubscription = ({ onBillingSession }: { onBillingSession: () => void }) => (
  <div className="manage-subscription-container">
    <p>Further, you can manage your subscription below:</p>
    <button className="btn-main btn btn-primary" type="button" onClick={onBillingSession}>
      Click Here
    </button>
  </div>
);

// Payment elements component using Stripe Pricing Table
const PaymentElements = ({ stripeCustomerSession }: { stripeCustomerSession: string | null }) => (
  stripeCustomerSession ? (

    <stripe-pricing-table pricing-table-id="prctbl_1Q2CZPP9gvplOqVlDrLWVdKk"
      publishable-key="pk_test_51OxYZdP9gvplOqVlLJtjogJXtKJxacCdw1GsKghcYG3nCxp7iSP1xRinEsOXmOI9lrgp72iImifmN54vtdagiFRH00gANu6J8l"
      customer-session-client-secret={stripeCustomerSession}>
    </stripe-pricing-table>
  ) : null
);

const SubscriptionPopUp = ({
  show,
  handleClose,
}: {
  show?: boolean;
  handleClose?: () => void;
}) => {
  const [stripeCustomerSession, setStripeCustomerSession] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState<string | null>(null);
  const isInactive = subscribed === "inactive";

  // Fetch Stripe customer session and subscription status
  useEffect(() => {
    const fetchStripeCustomerSession = async () => {
      try {
        const data = await getCustomerIntentAPI();
        if (data.status === "success") {
          setStripeCustomerSession(data.data.client_secret);
        } else {
          toast.error("Failed to fetch Stripe customer session.");
        }
      } catch (error) {
        console.error("Error fetching Stripe customer session:", error);
        toast.error("Failed to fetch Stripe customer session.");
      }
    };

    const getSubscriptionStatus = async () => {
      setLoading(true);
      try {
        const res = await verifySubscriptionAPI();
        if (res.status === "success") {
          const isSubscribed = res?.data?.status === "active" || res?.data?.status === "trialing";
          localStorage.setItem("isSubscribed", isSubscribed.toString());
          setSubscribed(res?.data?.status);
          if (res?.data?.status !== "active") {
            fetchStripeCustomerSession();
          }
        } else {
          toast.error("Failed to verify subscription.");
        }
      } catch (err) {
        console.error("Error verifying subscription:", err);
        toast.error("Failed to verify subscription.");
      } finally {
        setLoading(false);
      }
    };

    getSubscriptionStatus();
  }, []);

  // Generate billing session for managing subscription
  const generateBillingSession = async () => {
    try {
      const res = await createBillingSessionAPI();
      if (res.status === "success") {
        window.open(res?.data?.url, "_blank");
      } else {
        toast.error("Failed to generate billing session.");
      }
    } catch (err) {
      console.error("Error generating billing session:", err);
      toast.error("Failed to generate billing session.");
    }
  };

  // Main content of the subscription popup
  const SubscriptionContent = () => {
    if (subscribed === null) return null;
    return (
      <>
        <div className="header">
          <Title isInactive={isInactive} />
          <Description isInactive={isInactive} />
        </div>
        {!isInactive ? (
          <ManageSubscription onBillingSession={generateBillingSession} />
        ) : (
          <PaymentElements stripeCustomerSession={stripeCustomerSession} />
        )}
      </>
    );
  };

  return (
    <>
      {show && (
        <div className="custom-modal-overlay" onClick={handleClose}>
          <div className="custom-modal" onClick={(e) => e.stopPropagation()}>
            <div className="custom-modal-header">
              <h2>Subscribe to a Plan</h2>
              <button className="close-btn" onClick={handleClose}>
                &times;
              </button>
            </div>
            <div className="custom-modal-body">
              {loading ? (
                <div className="loader">
                  <img src={spinner} alt="Loading..." />
                </div>
              ) : (
                <SubscriptionContent />
              )}
            </div>
            <div className="custom-modal-footer">
              <button className="btn-main btn-secondary" onClick={handleClose}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SubscriptionPopUp;