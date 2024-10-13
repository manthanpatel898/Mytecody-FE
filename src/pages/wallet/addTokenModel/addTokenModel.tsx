import React, { useState, useEffect } from 'react';
import './addTokenModel.scss'; // Add the relevant styles
import { useStripe } from '@stripe/react-stripe-js';
import { toast } from 'react-toastify';
import AddPaymentMethodModal from '../addPaymentMethodModal/addPaymentMethodModal';
import { getPaymentMethodAPI } from '../../../service/Wallet.service';
import spinner from '../../../assets/spinner.svg'; // Assuming you have a spinner icon

interface PaymentMethod {
  id: string;
  card?: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
}

const AddTokenModel = ({
  isOpen,
  onClose,
  onSubmit,
  paymentIntent,
  onPaymentComplete,
}: any) => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAddPaymentMethodModalOpen, setIsAddPaymentMethodModalOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const stripe = useStripe();

  useEffect(() => {
    if (isOpen) {
      getPaymentMethods();
    }
  }, [isOpen]);

  const getPaymentMethods = async () => {
    try {
      const response = await getPaymentMethodAPI();
      if (response?.status === 'success') {
        const methods = response.data.payment_methods.data;
        setPaymentMethods(methods);
        if (methods.length > 0) {
          setSelectedPaymentMethod(methods[0].id);
        }
      } else {
        console.error('Error fetching payment methods:');
      }
    } catch (error) {
      console.error('Error fetching wallet info:', error);
    }
  };

  useEffect(() => {
    if (paymentIntent) {
      handleConfirmPayment(paymentIntent.client_secret);
    }
  }, [paymentIntent]);

  const handleSubmit = (event: any) => {
    event.preventDefault();
    const amount = event.target.elements.tokens.value;
    onSubmit(amount, selectedPaymentMethod);
  };

  const handleConfirmPayment = async (clientSecret: string) => {
    if (!stripe) {
      console.error('Stripe has not loaded yet.');
      return;
    }
    setIsProcessing(true);
    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: selectedPaymentMethod,
      });
      if (error) {
        console.error('Payment confirmation error: ', error);
        toast.error(error.message);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onPaymentComplete(paymentIntent);
        toast.success('Payment successful!');
      }
    } catch (err) {
      console.error('Error during payment confirmation: ', err);
      toast.error('Payment confirmation failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddPaymentMethod = () => {
    setIsAddPaymentMethodModalOpen(true);
  };

  const handlePaymentMethodChange = (event: any) => {
    setSelectedPaymentMethod(event.target.value);
  };

  return (
    <div className={`modal-overlay ${isOpen ? 'open' : ''}`}>
      <div className="modal-content">
        <h2>Add Tokens</h2>
        <form onSubmit={handleSubmit}>
          <div className={`floating-label ${isActive ? 'active' : ''}`}>
            <input
              className="inputField"
              type="number"
              id="tokens"
              name="tokens"
              placeholder="Amount in $"
              onFocus={() => setIsActive(true)}
              onBlur={(e) => e.target.value === '' && setIsActive(false)}
            />
            <label>Amount in $</label>
            <span>19.99$ CAD / 10 million tokens</span>
          </div>

          <div className="floating-label">
            <select
              id="paymentMethod"
              name="paymentMethod"
              className="inputField"
              value={selectedPaymentMethod}
              onChange={handlePaymentMethodChange}
              required
            >
              {paymentMethods?.map((method) => (
                method.card ? (
                  <option key={method.id} value={method.id}>
                    {method.card.brand} **** **** **** {method.card.last4} - Expires {method.card.exp_month}/{method.card.exp_year}
                  </option>
                ) : (
                  <option key={method.id} value={method.id}>
                    Payment Method {method.id}
                  </option>
                )
              ))}
            </select>
            <label>Payment Method</label>
            <span onClick={handleAddPaymentMethod}>+ Add payment method</span>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isProcessing}>
              Cancel
            </button>
            <button className="btn btn-primary" type="submit" disabled={isProcessing}>
              {isProcessing ? <img src={spinner} alt="Loading..." width={24} /> : 'Submit'}
            </button>
          </div>
        </form>
      </div>
      <AddPaymentMethodModal
        isOpen={isAddPaymentMethodModalOpen}
        onClose={() => setIsAddPaymentMethodModalOpen(false)}
        onPaymentMethodAdded={(newPaymentMethod: PaymentMethod) => {
          setPaymentMethods([...paymentMethods, newPaymentMethod]);
          setSelectedPaymentMethod(newPaymentMethod.id);
        }}
      />
    </div>
  );
};

export default AddTokenModel;