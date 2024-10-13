import React, { useEffect, useState } from "react";
import { loadStripe, PaymentIntent } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import "./wallet.scss";
import AddTokenModel from "./addTokenModel/addTokenModel";
import { toast } from "react-toastify";
import refreshImg from "../../assets/settings 1.svg";
import { getWalletInfoAPI, rechargeWalletAPI } from "../../service/Wallet.service";

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_PUBLISH_KEY || ""
);

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
        <div className="frameParent">
          <div className="frameGroup">
            <div className="tokensWrapper">
              <b className="tokens">Tokens</b>
            </div>
          </div>
          <div className="settingsRefresh" onClick={fetchWalletInfo}>
            <div className="settings1Parent">
              <img
                className="settings1Icon"
                loading="lazy"
                alt="Refresh"
                src={refreshImg}
              />
              <div className="refresh">Refresh</div>
            </div>
          </div>
        </div>

        {/* Progress Bar Section */}
        <div className="purchaseInfo">
          <div className="rectangleParent">
            <div className="frameChild" />
            <div
              className="totalBackground"
              style={{ width: `${calculateWidthPercentage()}%` }}
            >
              <div className="tooltip">
                Available Tokens: {formatToMillion(walletInfo.availableTokens)}
              </div>
            </div>
          </div>

          {/* Wallet Information */}
          <div className="availableSummary">
            <div className="availableAmount">
              <div className="availableValue">
                <b>{formatToMillion(walletInfo.availableTokens)}</b>
                <span>Available Tokens</span>
              </div>
              <div className="availableSeparator">
                <div className="availableSeparatorChild" />
              </div>
            </div>
            <div className="availableAmount">
              <div className="availableValue">
                <b>{formatToMillion(walletInfo.consumedTokens)}</b>
                <span>Consumed Tokens</span>
              </div>
              <div className="availableSeparator">
                <div className="availableSeparatorChild" />
              </div>
            </div>
            <div className="availableAmount">
              <div className="availableValue">
                <b>{formatToMillion(walletInfo.totalPurchasedTokens)}</b>
                <span>Total Purchased Tokens</span>
              </div>
              <div className="availableSeparator">
                <div className="availableSeparatorChild" />
              </div>
            </div>
            <div className="availableAmount">
              <div className="availableValue">
                <b>{formatToDollar(walletInfo.amountPaid)}</b>
                <span>Total Amount Paid</span>
              </div>
              <div className="availableSeparator">
                <div className="availableSeparatorChild" />
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="purchaseCTA">
            <div className="cTAContent">
              <div className="cTASeparator" />
              <b>You can purchase more tokens. Click the button below.</b>
            </div>
            <button className="buyTokensNow" onClick={() => setIsModalOpen(true)}>
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
      </div>
    </Elements>
  );
};

export default Wallet;
