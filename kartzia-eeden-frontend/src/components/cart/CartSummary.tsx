import React, { useMemo } from 'react';
import { useCartStore } from '../../context/cartStore';
import { EmptyState } from '../shared/errors/EmptyState';

interface CartSummaryProps {
  onCheckout?: () => void;
}

export const CartSummary: React.FC<CartSummaryProps> = ({ onCheckout }) => {
  const { items, getTotal, getItemCount } = useCartStore();

  const subtotal = useMemo(() => getTotal(), [getTotal]);
  const tax = useMemo(() => subtotal * 0.1, [subtotal]); // 10% tax
  const shipping = 5; // Fixed shipping
  const total = useMemo(() => subtotal + tax + shipping, [subtotal]);
  const itemCount = useMemo(() => getItemCount(), [getItemCount]);

  if (items.length === 0) {
    return (
      <EmptyState
        title="Your cart is empty"
        message="Add some items to get started"
        action={{
          label: 'Continue Shopping',
          onClick: () => window.location.href = '/',
        }}
      />
    );
  }

  return (
    <div
      className="cart-summary"
      style={{
        backgroundColor: '#f9f9f9',
        padding: '1.5rem',
        borderRadius: '8px',
        border: '1px solid #eee',
      }}
    >
      <h2 style={{ marginTop: 0 }}>Order Summary</h2>

      <div style={{ marginBottom: '1rem' }}>
        <p style={{ display: 'flex', justifyContent: 'space-between', margin: '0.5rem 0' }}>
          <span>Items ({itemCount}):</span>
          <span>${subtotal.toFixed(2)}</span>
        </p>
        <p style={{ display: 'flex', justifyContent: 'space-between', margin: '0.5rem 0' }}>
          <span>Tax (10%):</span>
          <span>${tax.toFixed(2)}</span>
        </p>
        <p style={{ display: 'flex', justifyContent: 'space-between', margin: '0.5rem 0' }}>
          <span>Shipping:</span>
          <span>${shipping.toFixed(2)}</span>
        </p>
      </div>

      <hr style={{ margin: '1rem 0', border: 'none', borderTop: '1px solid #ddd' }} />

      <p
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '1.25rem',
          fontWeight: 'bold',
          margin: '1rem 0',
        }}
      >
        <span>Total:</span>
        <span>${total.toFixed(2)}</span>
      </p>

      <button
        onClick={onCheckout}
        style={{
          width: '100%',
          padding: '0.75rem',
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontSize: '1rem',
          fontWeight: 500,
          cursor: 'pointer',
        }}
      >
        Proceed to Checkout
      </button>
    </div>
  );
};
