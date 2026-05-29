import React, { useState } from 'react';
import { CartItems } from '../components/cart/CartItems';
import { CartSummary } from '../components/cart/CartSummary';
import { useCartStore } from '../context/cartStore';

interface CartPageProps {
  onNavigate: (page: string) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ onNavigate }) => {
  const { items, clearCart } = useCartStore();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleClearCart = () => {
    clearCart();
    setShowClearConfirm(false);
  };

  return (
    <div className="cart-page">
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
          }}
        >
          <h1 style={{ margin: 0 }}>Shopping Cart</h1>
          {items.length > 0 && (
            <button
              onClick={() => setShowClearConfirm(true)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
              aria-label="Clear cart"
            >
              Clear Cart
            </button>
          )}
        </div>

        {showClearConfirm && (
          <div
            style={{
              backgroundColor: '#fff3cd',
              border: '1px solid #ffc107',
              borderRadius: '4px',
              padding: '1rem',
              marginBottom: '2rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
            role="alert"
          >
            <span>Are you sure you want to clear your cart?</span>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={handleClearCart}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Yes, Clear
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: items.length > 0 ? '1fr 350px' : '1fr',
            gap: '2rem',
          }}
        >
          {/* BUG FIX: pass onNavigate so CartItems doesn't use window.location.href */}
          <CartItems onNavigate={onNavigate} />

          {items.length > 0 && (
            <CartSummary onCheckout={() => onNavigate('checkout')} />
          )}
        </div>

        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => onNavigate('home')}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
            aria-label="Continue shopping"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};
