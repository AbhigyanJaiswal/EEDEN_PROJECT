import React from 'react';

interface OrderConfirmationProps {
  orderId: string;
  orderDate: string;
  total: number;
}

export const OrderConfirmation: React.FC<OrderConfirmationProps> = ({
  orderId,
  orderDate,
  total,
}) => {
  return (
    <div
      className="order-confirmation"
      style={{
        backgroundColor: '#d4edda',
        border: '1px solid #c3e6cb',
        borderRadius: '8px',
        padding: '2rem',
        textAlign: 'center',
      }}
      role="status"
      aria-live="polite"
    >
      <h2 style={{ color: '#155724', marginTop: 0 }}>Order Confirmed!</h2>
      <p style={{ color: '#155724', fontSize: '1.1rem' }}>
        Thank you for your purchase.
      </p>

      <div style={{ marginBottom: '1.5rem', textAlign: 'left', maxWidth: '400px', margin: '1.5rem auto' }}>
        <p>
          <strong>Order ID:</strong> {orderId}
        </p>
        <p>
          <strong>Order Date:</strong> {new Date(orderDate).toLocaleDateString()}
        </p>
        <p>
          <strong>Total Amount:</strong> ${total.toFixed(2)}
        </p>
      </div>

      <p style={{ color: '#666', marginBottom: '1rem' }}>
        A confirmation email has been sent to your registered email address.
      </p>

      <button
        onClick={() => (window.location.href = '/')}
        style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: '#155724',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '1rem',
        }}
      >
        Continue Shopping
      </button>
    </div>
  );
};
