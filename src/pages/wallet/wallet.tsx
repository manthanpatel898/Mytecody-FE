import React, { useEffect, useState } from "react";
import { loadStripe, PaymentIntent } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import "./wallet.scss"; // Ensure the new styles are added to this file
import AddTokenModel from "./addTokenModel/addTokenModel";
import { toast } from "react-toastify";
import refreshImg from "../../assets/settings 1.svg";
import { getWalletInfoAPI, rechargeWalletAPI } from "../../service/Wallet.service";

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISH_KEY || "");

const Wallet = () => {
  const [walletInfo, setWalletInfo] = useState({
    availableTokens: 0,
    consumedTokens: 0,
    totalPurchasedTokens: 0,
    amountPaid: 0,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntent | null>(null);
  const [paymentResponse, setPaymentResponse] = useState<PaymentIntent | null>(null);

  // Fetch wallet information
  const fetchWalletInfo = async () => {
    try {
      const response = await getWalletInfoAPI();
      if (response?.status === "success") {
        setWalletInfo(response.data);
      } else {
        toast.error("Failed to fetch wallet info.");
      }
    } catch (error) {
      console.error("Error fetching wallet info:", error);
    }
  };

  // Handle adding tokens (payment)
  const handleAddTokens = async (amount: number, paymentMethodId: string) => {
    const payload = { amount, payment_method_id: paymentMethodId };
    try {
      const response = await rechargeWalletAPI(payload);
      if (response?.status === "success") {
        setPaymentIntent(response.data.payment_intent);
      } else {
        toast.error("Failed to add tokens.");
      }
    } catch (error) {
      console.error("Error recharging wallet:", error);
      toast.error("Error while recharging wallet.");
    }
  };

  // Handle payment completion
  const handlePaymentComplete = (paymentIntent: PaymentIntent) => {
    setPaymentResponse(paymentIntent);
    setIsModalOpen(false);
    fetchWalletInfo();
  };

  // Format large numbers to millions
  const formatToMillion = (number: number) => {
    return number >= 1000000 ? `${(number / 1000000).toFixed(1)}M` : number.toString();
  };

  // Format numbers to dollar value
  const formatToDollar = (number: number) => {
    return number >= 100 ? `${(number / 100).toFixed(1)}$` : number.toString();
  };

  // Calculate width percentage for progress bar
  const calculateWidthPercentage = () => {
    const totalTokens = walletInfo.availableTokens + walletInfo.consumedTokens;
    return totalTokens === 0 ? 0 : (walletInfo.availableTokens / totalTokens) * 100;
  };

  useEffect(() => {
    fetchWalletInfo();
  }, []);

  return (
    <Elements stripe={stripePromise}>
      <div className="wallet-outer">
        {/* Header Section */}
        <div className="wallet-header">
          <div>Tokens</div>
          <div className="refresh-wrapper" onClick={fetchWalletInfo}>
            <img className="refresh-icon" loading="lazy" alt="Refresh" src={refreshImg} />
            <span className="refresh-text">Refresh</span>
          </div>
        </div>

        {/* Progress Bar Section */}
        <div className="progress-bar-section">
          <div className="progress-bar-background">
            <div className="progress-bar" style={{ width: `${calculateWidthPercentage()}%` }}>
              <div className="tooltip">Available Tokens: {formatToMillion(walletInfo.availableTokens)}</div>
            </div>
          </div>
        </div>
        <div className="color-indicators">
  <div className="indicator-item available-indicator">
    <div className="indicator-box"></div>
    <span>Available Tokens</span>
  </div>
  <div className="indicator-item consumed-indicator">
    <div className="indicator-box"></div>
    <span>Consumed Tokens</span>
  </div>
</div>

        {/* Token Information Section */}
        <div className="available-summary">
          <div className="available-amount">
            <b>{formatToMillion(walletInfo.availableTokens)}</b>
            <span>Available Tokens</span>
            <div className="available-separator" />
          </div>
          <div className="available-amount">
            <b>{formatToMillion(walletInfo.consumedTokens)}</b>
            <span>Consumed Tokens</span>
            <div className="available-separator" />
          </div>
          <div className="available-amount">
            <b>{formatToMillion(walletInfo.totalPurchasedTokens)}</b>
            <span>Total Purchased Tokens</span>
            <div className="available-separator" />
          </div>
          <div className="available-amount">
            <b>{formatToDollar(walletInfo.amountPaid)}</b>
            <span>Total Amount Paid</span>
            <div className="available-separator" />
          </div>
        </div>

        {/* CTA Section */}
        <div className="purchase-cta">
          <p>You can purchase more tokens. Click the button below.</p>
          <button className="buy-tokens-btn" onClick={() => setIsModalOpen(true)}>
            Buy Tokens Now
          </button>
        </div>

        {/* Add Tokens Modal */}
        <AddTokenModel
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddTokens}
          paymentIntent={paymentIntent}
          onPaymentComplete={handlePaymentComplete}
        />
      </div>
    </Elements>
  );
};

export default Wallet;
