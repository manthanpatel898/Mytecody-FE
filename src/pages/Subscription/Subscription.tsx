import React, { useEffect, useState } from "react";
import "./Subscription.scss";
import {
  createBillingSessionAPI,
  getCustomerIntentAPI,
  verifySubscriptionAPI,
} from "../../service/subscription.service";
import { toast } from "react-toastify";
import spinner from "../../assets/spinner.svg";
const loadStripeScript = () => {
  if (!document.querySelector('script[src="https://js.stripe.com/v3/pricing-table.js"]')) {
    const script = document.createElement("script");
    script.src = "https://js.stripe.com/v3/pricing-table.js";
    script.async = true;
    document.body.appendChild(script);
  }
};

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

const Subscription = () => {
  const [stripeCustomerSession, setStripeCustomerSession] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState<string | null>(null);
  const isInactive = subscribed === "inactive";

  useEffect(() => {
    loadStripeScript(); // Load the Stripe script when the component mounts

    const fetchStripeCustomerSession = async () => {
      try {
        const data = await getCustomerIntentAPI();
        if (data?.status === "success") {
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
        if (res?.status === "success") {
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

  const generateBillingSession = async () => {
    try {
      const res = await createBillingSessionAPI();
      if (res?.status === "success") {
        window.open(res?.data?.url, "_blank");
      } else {
        toast.error("Failed to generate billing session.");
      }
    } catch (err) {
      console.error("Error generating billing session:", err);
      toast.error("Failed to generate billing session.");
    }
  };

  const Title = () => (
    <div className="title">
      {isInactive ? "Payment Details" : "Verified Payment Details"}
    </div>
  );

  const Description = () => (
    <p>
      {isInactive
        ? "Please set your payment method"
        : "Payment method has been verified successfully!"}
    </p>
  );

  const ManageSubscription = () => (
    <div className="manage-subscription-container">
      <p>You can manage your subscription from below:</p>
      <button
        className="btn-main btn btn-primary"
        type="button"
        onClick={generateBillingSession}
      >
        Manage Subscription
      </button>
    </div>
  );

  const PaymentElements = () => (
    stripeCustomerSession ? (
      <stripe-pricing-table pricing-table-id="prctbl_1Q2CZPP9gvplOqVlDrLWVdKk"
      publishable-key="pk_test_51OxYZdP9gvplOqVlLJtjogJXtKJxacCdw1GsKghcYG3nCxp7iSP1xRinEsOXmOI9lrgp72iImifmN54vtdagiFRH00gANu6J8l"
      customer-session-client-secret={stripeCustomerSession}>
    </stripe-pricing-table>
    ) : <div>test</div>
  );

  const SubscriptionContent = () => {
    if (subscribed === null) return null;
    return (
      <>
        <div className="header">
          <Title />
          <Description />
        </div>

        <PaymentElements />
        {/* {!isInactive ? <ManageSubscription /> : <PaymentElements />} */}
      </>
    );
  };

  return (
    <>
      <div className="subscriptionPageWrapper">
        {loading ? (
          <div className="loader">
            <img src={spinner} alt="Loading..." />
          </div>
        ) : (
          <SubscriptionContent />
        )}
      </div>
    </>
  );
};

export default Subscription;