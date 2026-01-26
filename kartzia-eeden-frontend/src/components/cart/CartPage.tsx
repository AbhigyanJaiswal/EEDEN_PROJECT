import React, { useState } from 'react';
import { useCartStore } from '@context/cartStore';
import { EmptyState } from '@components/shared/errors/EmptyState';
import { LoadingState } from '@components/shared/errors/LoadingState';

interface CartPageProps {
  onCheckout?: () => void;
}

export const CartPage: React.FC<CartPageProps> = ({ onCheckout }) => {
  const { items, total, removeItem, updateQuantity } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);

  if (isLoading) {
    return <LoadingState message="Updating cart..." />;
  }

  if (items.length === 0) {
    return (
      <EmptyState
        message="Your cart is empty"
        icon="🛒"
        actionLabel="Continue Shopping"
        onAction={() => window.location.href = '/'}
      />
    );
  }

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  return (
    <div className="cart-page">
      <h1>Shopping Cart</h1>
      <div className="cart-items" role="region" aria-label="Cart items list">
        {items.map((item) => (
          <div key={item.id} className="cart-item" role="article">
            <img src={item.image} alt={item.name} />
            <div className="item-details">
              <h3>{item.name}</h3>
              <p className="price">${item.price.toFixed(2)}</p>
            </div>
            <div className="item-quantity">
              <button
                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                aria-label={`Decrease ${item.name} quantity`}
                disabled={item.quantity <= 1}
              >
                −
              </button>
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                aria-label={`${item.name} quantity`}
              />
              <button
                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                aria-label={`Increase ${item.name} quantity`}
              >
                +
              </button>
            </div>
            <div className="item-total">
              ${(item.price * item.quantity).toFixed(2)}
            </div>
            <button
              onClick={() => removeItem(item.id)}
              className="remove-button"
              aria-label={`Remove ${item.name} from cart`}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary" role="region" aria-label="Cart summary">
        <div className="summary-row">
          <span>Subtotal:</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span>Shipping:</span>
          <span>Calculated at checkout</span>
        </div>
        <div className="summary-row total">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <button
        onClick={onCheckout}
        className="checkout-button"
        aria-label="Proceed to checkout"
      >
        Proceed to Checkout
      </button>
    </div>
  );
};
