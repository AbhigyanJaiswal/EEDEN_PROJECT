import React, { useState } from 'react';
import { CheckoutForm } from '../components/checkout/CheckoutForm';
import { OrderConfirmation } from '../components/order/OrderConfirmation';
import { useCartStore } from '../context/cartStore';
import { useAuthStore } from '../context/authStore';

const TAX_RATE = 0.1;
const SHIPPING_COST = 5;

interface CheckoutPageProps {
  onNavigate: (page: string) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigate }) => {
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderId, setOrderId] = useState<string>('');
  const { items, getTotal, clearCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  // BUG FIX: auth guard — redirect unauthenticated users to login
  if (!isAuthenticated) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <div
          style={{
            backgroundColor: '#e7d4f5',
            border: '1px solid #b19cd9',
            borderRadius: '4px',
            padding: '2rem',
            textAlign: 'center',
          }}
          role="alert"
        >
          <h2>Please log in to checkout</h2>
          <p>You need to be signed in to place an order.</p>
          <button
            onClick={() => onNavigate('auth')}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '1rem',
            }}
          >
            Log In / Sign Up
          </button>
          <button
            onClick={() => onNavigate('cart')}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Back to Cart
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0 && !orderConfirmed) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <div
          style={{
            backgroundColor: '#fff3cd',
            border: '1px solid #ffc107',
            borderRadius: '4px',
            padding: '2rem',
            textAlign: 'center',
          }}
          role="alert"
        >
          <h2>Your cart is empty</h2>
          <p>Please add items to your cart before proceeding to checkout</p>
          <button
            onClick={() => onNavigate('home')}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const handleOrderSuccess = (newOrderId: string) => {
    setOrderId(newOrderId);
    setOrderConfirmed(true);
    clearCart();
  };

  if (orderConfirmed) {
    // BUG FIX: pass the full total (with tax + shipping) to match what user saw at checkout
    const subtotal = getTotal();
    const fullTotal = subtotal + subtotal * TAX_RATE + SHIPPING_COST;
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <OrderConfirmation
          orderId={orderId}
          orderDate={new Date().toISOString()}
          total={fullTotal}
          onNavigate={onNavigate}
        />
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button
            onClick={() => onNavigate('orders')}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '1rem',
            }}
          >
            View Orders
          </button>
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
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  // BUG FIX: checkout page and CartSummary now use the same tax + shipping breakdown
  const subtotal = getTotal();
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax + SHIPPING_COST;

  return (
    <div className="checkout-page">
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
        <h1>Checkout</h1>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 350px',
            gap: '2rem',
          }}
        >
          <div>
            <CheckoutForm onSuccess={handleOrderSuccess} />
          </div>

          {/* BUG FIX: order summary now shows tax + shipping, consistent with CartSummary */}
          <div
            style={{
              backgroundColor: '#f9f9f9',
              padding: '1.5rem',
              borderRadius: '8px',
              height: 'fit-content',
            }}
          >
            <h3 style={{ marginTop: 0 }}>Order Summary</h3>
            <div style={{ marginBottom: '1rem' }}>
              {items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    paddingBottom: '0.5rem',
                    marginBottom: '0.5rem',
                    borderBottom: '1px solid #eee',
                  }}
                >
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <hr style={{ margin: '0.75rem 0', border: 'none', borderTop: '1px solid #ddd' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Tax (10%):</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Shipping:</span>
              <span>${SHIPPING_COST.toFixed(2)}</span>
            </div>
            <hr style={{ margin: '1rem 0', border: 'none', borderTop: '2px solid #ddd' }} />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '1.25rem',
                fontWeight: 'bold',
              }}
            >
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <button
            onClick={() => onNavigate('cart')}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
            aria-label="Back to cart"
          >
            ← Back to Cart
          </button>
        </div>
      </div>
    </div>
  );
};
