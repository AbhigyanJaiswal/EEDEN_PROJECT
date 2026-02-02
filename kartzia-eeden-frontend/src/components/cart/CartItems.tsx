import React, { useCallback, memo } from 'react';
import { useCartStore, CartItem } from '../../context/cartStore';
import { EmptyState } from '../shared/errors/EmptyState';

export const CartItems: React.FC = memo(() => {
  const { items, removeItem, updateQuantity } = useCartStore();

  const handleQuantityChange = useCallback(
    (id: string, newQuantity: number) => {
      if (newQuantity > 0) {
        updateQuantity(id, newQuantity);
      }
    },
    [updateQuantity]
  );

  const handleRemove = useCallback(
    (id: string) => {
      removeItem(id);
    },
    [removeItem]
  );

  if (items.length === 0) {
    return (
      <EmptyState
        title="Your cart is empty"
        message="Browse our products and add items to your cart"
        action={{
          label: 'Continue Shopping',
          onClick: () => window.location.href = '/',
        }}
      />
    );
  }

  return (
    <div className="cart-items">
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginBottom: '2rem',
        }}
        role="presentation"
      >
        <thead>
          <tr style={{ borderBottom: '2px solid #ddd' }}>
            <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 'bold' }}>Product</th>
            <th style={{ textAlign: 'center', padding: '1rem', fontWeight: 'bold' }}>Price</th>
            <th style={{ textAlign: 'center', padding: '1rem', fontWeight: 'bold' }}>Quantity</th>
            <th style={{ textAlign: 'right', padding: '1rem', fontWeight: 'bold' }}>Total</th>
            <th style={{ textAlign: 'center', padding: '1rem', fontWeight: 'bold' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item: CartItem) => (
            <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '1rem' }}>
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: '50px', height: '50px', marginRight: '1rem', borderRadius: '4px' }}
                  />
                )}
                <span>{item.name}</span>
              </td>
              <td style={{ textAlign: 'center', padding: '1rem' }}>${item.price.toFixed(2)}</td>
              <td style={{ textAlign: 'center', padding: '1rem' }}>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                  style={{
                    width: '60px',
                    padding: '0.25rem',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    textAlign: 'center',
                  }}
                  aria-label={`Quantity of ${item.name}`}
                />
              </td>
              <td style={{ textAlign: 'right', padding: '1rem', fontWeight: 'bold' }}>
                ${(item.price * item.quantity).toFixed(2)}
              </td>
              <td style={{ textAlign: 'center', padding: '1rem' }}>
                <button
                  onClick={() => handleRemove(item.id)}
                  style={{
                    padding: '0.25rem 0.75rem',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                  }}
                  aria-label={`Remove ${item.name} from cart`}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

CartItems.displayName = 'CartItems';
