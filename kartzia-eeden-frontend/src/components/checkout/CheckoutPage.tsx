import React, { useState } from 'react';
import { useCartStore } from '@context/cartStore';
import { useAuthStore } from '@context/authStore';
import { orderApi } from '@utils/api/endpoints';
import { LoadingState } from '@components/shared/errors/LoadingState';
import { ErrorState } from '@components/shared/errors/ErrorState';

interface CheckoutPageProps {
  onSuccess?: (orderId: string) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onSuccess }) => {
  const { items, total, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [currentStep, setCurrentStep] = useState<'shipping' | 'payment' | 'review'>('shipping');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    shippingAddress: '',
    shippingMethod: 'standard',
    paymentMethod: 'card',
  });

  const shippingCost = formData.shippingMethod === 'express' ? 15 : 5;
  const finalTotal = total + shippingCost;

  const handleStepChange = (step: 'shipping' | 'payment' | 'review') => {
    setCurrentStep(step);
    setError(null);
  };

  const handleSubmitOrder = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await orderApi.createOrder({
        userId: user?.id,
        items,
        shippingAddress: formData.shippingAddress,
        shippingMethod: formData.shippingMethod,
        paymentMethod: formData.paymentMethod,
        total: finalTotal,
      });

      if (response.success && response.data) {
        clearCart();
        // Assuming response.data contains orderId
        onSuccess?.((response.data as any).orderId || 'order-created');
      } else {
        setError(response.error?.message || 'Failed to create order');
      }
    } catch (err) {
      setError('An error occurred while processing your order');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingState message="Processing your order..." />;
  }

  if (error) {
    return (
      <ErrorState
        message={error}
        retry={() => setError(null)}
      />
    );
  }

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      {/* Progress Indicator */}
      <div className="checkout-progress" role="progressbar" aria-valuenow={currentStep === 'review' ? 3 : currentStep === 'payment' ? 2 : 1} aria-valuemin={1} aria-valuemax={3}>
        <div className={`step ${currentStep === 'shipping' || currentStep === 'payment' || currentStep === 'review' ? 'active' : ''}`}>
          <span>1. Shipping</span>
        </div>
        <div className={`step ${currentStep === 'payment' || currentStep === 'review' ? 'active' : ''}`}>
          <span>2. Payment</span>
        </div>
        <div className={`step ${currentStep === 'review' ? 'active' : ''}`}>
          <span>3. Review</span>
        </div>
      </div>

      {/* Shipping Step */}
      {currentStep === 'shipping' && (
        <section className="checkout-section">
          <h2>Shipping Information</h2>
          <div className="form-group">
            <label htmlFor="shipping-address">Shipping Address</label>
            <select
              id="shipping-address"
              value={formData.shippingAddress}
              onChange={(e) => setFormData((prev) => ({ ...prev, shippingAddress: e.target.value }))}
              required
            >
              <option value="">Select an address</option>
              <option value="saved-1">123 Main St, City, State 12345</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="shipping-method">Shipping Method</label>
            <select
              id="shipping-method"
              value={formData.shippingMethod}
              onChange={(e) => setFormData((prev) => ({ ...prev, shippingMethod: e.target.value }))}
            >
              <option value="standard">Standard (5-7 days) - $5.00</option>
              <option value="express">Express (2-3 days) - $15.00</option>
            </select>
          </div>

          <button
            onClick={() => handleStepChange('payment')}
            disabled={!formData.shippingAddress}
            className="next-button"
          >
            Continue to Payment
          </button>
        </section>
      )}

      {/* Payment Step */}
      {currentStep === 'payment' && (
        <section className="checkout-section">
          <h2>Payment Method</h2>
          <div className="form-group">
            <label htmlFor="payment-method">Select Payment Method</label>
            <select
              id="payment-method"
              value={formData.paymentMethod}
              onChange={(e) => setFormData((prev) => ({ ...prev, paymentMethod: e.target.value }))}
            >
              <option value="card">Credit/Debit Card</option>
              <option value="paypal">PayPal</option>
              <option value="bank">Bank Transfer</option>
            </select>
          </div>

          <div className="button-group">
            <button onClick={() => handleStepChange('shipping')} className="back-button">
              Back
            </button>
            <button onClick={() => handleStepChange('review')} className="next-button">
              Continue to Review
            </button>
          </div>
        </section>
      )}

      {/* Review Step */}
      {currentStep === 'review' && (
        <section className="checkout-section">
          <h2>Order Review</h2>

          <div className="review-section">
            <h3>Items</h3>
            {items.map((item) => (
              <div key={item.id} className="review-item">
                <span>{item.name}</span>
                <span>x{item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="review-summary">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping:</span>
              <span>${shippingCost.toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>${finalTotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="button-group">
            <button onClick={() => handleStepChange('payment')} className="back-button">
              Back
            </button>
            <button onClick={handleSubmitOrder} className="submit-button" aria-busy={isLoading}>
              Place Order
            </button>
          </div>
        </section>
      )}
    </div>
  );
};
