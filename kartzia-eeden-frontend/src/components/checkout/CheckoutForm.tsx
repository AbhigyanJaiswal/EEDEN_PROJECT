import React, { useState, memo } from 'react';
import { useForm } from '../../hooks/useForm';
import { checkoutSchema, type CheckoutFormData } from '../../utils/validation/schemas';
import { ErrorState } from '../shared/errors/ErrorState';
import { LoadingState } from '../shared/errors/LoadingState';

interface CheckoutFormProps {
  onSuccess?: (orderId: string) => void;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = memo(({ onSuccess }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<CheckoutFormData>(
    {
      shippingAddress: {
        fullName: '',
        phone: '',
        streetAddress: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
      },
      billingAddress: undefined,
      sameAsShipping: true,
      paymentMethod: 'credit-card' as const,
      cardNumber: '',
      cardExpiry: '',
      cardCVV: '',
    },
    checkoutSchema,
    async (values) => {
      try {
        setSubmitError(null);
        // API call would go here
        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          throw new Error('Checkout failed');
        }

        const data = await response.json();
        onSuccess?.(data.orderId);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Checkout failed';
        setSubmitError(message);
      }
    }
  );

  if (form.isSubmitting) {
    return <LoadingState message="Processing your order..." />;
  }

  return (
    <form onSubmit={form.handleSubmit(() => {})} noValidate aria-label="Checkout form">
      {submitError && <ErrorState message={submitError} />}

      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          {[1, 2, 3].map((step) => (
            <button
              key={step}
              type="button"
              onClick={() => setCurrentStep(step)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: currentStep === step ? '#007bff' : '#ddd',
                color: currentStep === step ? 'white' : '#333',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
              aria-current={currentStep === step ? 'step' : undefined}
            >
              Step {step}
            </button>
          ))}
        </div>
      </div>

      {/* Step 1: Shipping Address */}
      {currentStep === 1 && (
        <div style={{ marginBottom: '2rem' }}>
          <h3>Shipping Address</h3>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label htmlFor="fullName" style={{ display: 'block', marginBottom: '0.5rem' }}>
              Full Name *
            </label>
            <input
              id="fullName"
              type="text"
              name="fullName"
              value={form.values.shippingAddress.fullName}
              onChange={(e) =>
                form.setFieldValue('shippingAddress', {
                  ...form.values.shippingAddress,
                  fullName: e.target.value,
                })
              }
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '4px',
                border: `1px solid ${(form as any).errors?.shippingAddress?.fullName ? '#c00' : '#ccc'}`,
              }}
              required
            />
          </div>

          <button
            type="button"
            onClick={() => setCurrentStep(2)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Next Step
          </button>
        </div>
      )}

      {/* Step 2: Billing Address */}
      {currentStep === 2 && (
        <div style={{ marginBottom: '2rem' }}>
          <h3>Billing Address</h3>
          <label style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            <input
              type="checkbox"
              name="sameAsShipping"
              checked={form.values.sameAsShipping}
              onChange={(e) => form.setFieldValue('sameAsShipping', e.target.checked)}
              style={{ marginRight: '0.5rem' }}
            />
            Same as shipping address
          </label>

          <button
            type="button"
            onClick={() => setCurrentStep(3)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Next Step
          </button>
        </div>
      )}

      {/* Step 3: Payment */}
      {currentStep === 3 && (
        <div style={{ marginBottom: '2rem' }}>
          <h3>Payment Method</h3>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label htmlFor="paymentMethod" style={{ display: 'block', marginBottom: '0.5rem' }}>
              Select Payment Method *
            </label>
            <select
              id="paymentMethod"
              name="paymentMethod"
              value={form.values.paymentMethod}
              onChange={(e) => form.setFieldValue('paymentMethod', e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid #ccc',
              }}
              required
            >
              <option value="credit-card">Credit Card</option>
              <option value="debit-card">Debit Card</option>
              <option value="paypal">PayPal</option>
              <option value="bank-transfer">Bank Transfer</option>
            </select>
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold',
            }}
            aria-busy={form.isSubmitting}
          >
            Place Order
          </button>
        </div>
      )}
    </form>
  );
});

CheckoutForm.displayName = 'CheckoutForm';
