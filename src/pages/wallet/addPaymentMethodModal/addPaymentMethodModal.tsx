import React, { useState } from 'react';
import './AddPaymentMethodModal.scss'; // Add the relevant styles
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { toast } from 'react-toastify';
import { PaymentMethod } from '@stripe/stripe-js';
import { addPaymentMethodAPI } from '../../../service/Wallet.service';
import spinner from '../../../assets/spinner.svg'; // Assuming you have a spinner icon

interface AddPaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentMethodAdded: (paymentMethod: PaymentMethod) => void;
}

const AddPaymentMethodModal: React.FC<AddPaymentMethodModalProps> = ({
  isOpen,
  onClose,
  onPaymentMethodAdded,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError('');

    const cardElement = elements.getElement(CardElement);

    if (cardElement) {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        console.error(error);
        toast.error(error.message);
        setIsProcessing(false);
      } else {
        try {
          const payload = {
            paymentMethodId: paymentMethod?.id,
          };
          const response = await addPaymentMethodAPI(payload);
          if (response?.status === 'success') {
            onPaymentMethodAdded(paymentMethod);
            toast.success('Payment method added successfully!');
            onClose();
          } else {
            console.error('Failed to attach payment method to customer.');
            toast.error('Failed to attach payment method to customer.');
          }
        } catch (err) {
          console.error('Error attaching payment method to customer:', err);
          toast.error('Error attaching payment method to customer.');
        } finally {
          setIsProcessing(false);
        }
      }
    }
  };

  return (
    <div className={`modal-overlay ${isOpen ? 'open' : ''}`}>
      <div className="modal-content">
        <h2>Add Payment Method</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <CardElement options={{ style: { base: { fontSize: '18px' } } }} />
            {error && <span className="error-message">{error}</span>}
          </div>

          <div className="modal-actions">
            <button
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isProcessing}
            >
              Close
            </button>
            <button className="btn btn-primary" type="submit" disabled={isProcessing}>
              {isProcessing ? (
                <img src={spinner} alt="Processing..." width={24} />
              ) : (
                'Add Payment Method'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPaymentMethodModal;