import React from 'react';

interface OrderConfirmationProps {
  orderId: string;
  total: number;
  estimatedDelivery: string;
  onContinue?: () => void;
}

export const OrderConfirmation: React.FC<OrderConfirmationProps> = ({
  orderId,
  total,
  estimatedDelivery,
  onContinue,
}) => {
  return (
    <div className="order-confirmation" role="main">
      <div className="confirmation-header">
        <div className="success-icon">✓</div>
        <h1>Order Confirmed!</h1>
        <p>Thank you for your purchase</p>
      </div>

      <div className="confirmation-details">
        <div className="detail-row">
          <span>Order ID:</span>
          <strong>{orderId}</strong>
        </div>
        <div className="detail-row">
          <span>Total:</span>
          <strong>${total.toFixed(2)}</strong>
        </div>
        <div className="detail-row">
          <span>Estimated Delivery:</span>
          <strong>{estimatedDelivery}</strong>
        </div>
      </div>

      <div className="confirmation-message">
        <p>A confirmation email has been sent to your registered email address.</p>
        <p>You can track your order status in your account dashboard.</p>
      </div>

      <button onClick={onContinue} className="continue-button">
        Continue Shopping
      </button>
    </div>
  );
};
