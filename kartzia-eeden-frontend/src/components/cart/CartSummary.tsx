import React, { useMemo } from 'react';
import { useCartStore } from '../../context/cartStore';

const TAX_RATE = 0.1;
const SHIPPING_COST = 5;

interface CartSummaryProps {
  onCheckout?: () => void;
}

export const CartSummary: React.FC<CartSummaryProps> = ({ onCheckout }) => {
  const { items, getTotal, getItemCount } = useCartStore();

  const subtotal = useMemo(() => getTotal(), [getTotal, items]);
  // BUG FIX: tax and shipping calculation consistent with CheckoutPage
  const tax = useMemo(() => subtotal * TAX_RATE, [subtotal]);
  const total = useMemo(() => subtotal + tax + SHIPPING_COST, [subtotal, tax]);
  const itemCount = useMemo(() => getItemCount(), [getItemCount, items]);

  if (items.length === 0) return null;

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
          <span>${SHIPPING_COST.toFixed(2)}</span>
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
