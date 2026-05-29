import React, { useState, memo } from 'react';
import { useForm } from '../../hooks/useForm';
import { checkoutSchema, type CheckoutFormData } from '../../utils/validation/schemas';
import { ErrorState } from '../shared/errors/ErrorState';
import { LoadingState } from '../shared/errors/LoadingState';
import { orderApi } from '../../utils/api/endpoints';

interface CheckoutFormProps {
  onSuccess?: (orderId: string) => void;
}

const inputStyle = (hasError: boolean): React.CSSProperties => ({
  width: '100%',
  padding: '0.5rem',
  borderRadius: '4px',
  border: `1px solid ${hasError ? '#c00' : '#ccc'}`,
  fontSize: '1rem',
  boxSizing: 'border-box',
});

const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: '0.5rem',
  fontWeight: 500,
};

const fieldStyle: React.CSSProperties = { marginBottom: '1rem' };

export const CheckoutForm: React.FC<CheckoutFormProps> = memo(({ onSuccess }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // BUG FIX: onSubmit callback is defined here and used properly via useForm
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
        const result = await orderApi.createOrder(values);
        if (!result.success || !result.data) {
          throw new Error(result.error || 'Checkout failed');
        }
        const data = result.data as { orderId: string };
        onSuccess?.(data.orderId);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Checkout failed';
        setSubmitError(message);
      }
    }
  );

  const shippingErrors = (form.errors as Record<string, Record<string, string>>)
    .shippingAddress ?? {};

  if (form.isSubmitting) {
    return <LoadingState message="Processing your order..." />;
  }

  const stepLabels = ['Shipping', 'Billing', 'Payment'];

  return (
    // BUG FIX: form.handleSubmit() with no argument falls back to the onSubmit above
    <form onSubmit={form.handleSubmit()} noValidate aria-label="Checkout form">
      {submitError && <ErrorState message={submitError} />}

      {/* Step Indicators */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        {[1, 2, 3].map((step) => (
          <button
            key={step}
            type="button"
            onClick={() => setCurrentStep(step)}
            style={{
              flex: 1,
              padding: '0.5rem',
              margin: '0 0.25rem',
              backgroundColor: currentStep === step ? '#007bff' : currentStep > step ? '#28a745' : '#ddd',
              color: currentStep >= step ? 'white' : '#333',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: currentStep === step ? 'bold' : 'normal',
            }}
            aria-current={currentStep === step ? 'step' : undefined}
          >
            {currentStep > step ? '✓ ' : ''}{stepLabels[step - 1]}
          </button>
        ))}
      </div>

      {/* BUG FIX: Step 1 now includes ALL shipping address fields, not just fullName */}
      {currentStep === 1 && (
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginTop: 0 }}>Shipping Address</h3>

          <div style={fieldStyle}>
            <label htmlFor="sh-fullName" style={labelStyle}>Full Name *</label>
            <input
              id="sh-fullName"
              type="text"
              value={form.values.shippingAddress.fullName}
              onChange={(e) =>
                form.setFieldValue('shippingAddress', {
                  ...form.values.shippingAddress,
                  fullName: e.target.value,
                })
              }
              style={inputStyle(!!shippingErrors.fullName)}
              required
            />
            {shippingErrors.fullName && (
              <span style={{ color: '#c00', fontSize: '0.875rem' }}>{shippingErrors.fullName}</span>
            )}
          </div>

          <div style={fieldStyle}>
            <label htmlFor="sh-phone" style={labelStyle}>Phone *</label>
            <input
              id="sh-phone"
              type="tel"
              value={form.values.shippingAddress.phone}
              onChange={(e) =>
                form.setFieldValue('shippingAddress', {
                  ...form.values.shippingAddress,
                  phone: e.target.value,
                })
              }
              style={inputStyle(!!shippingErrors.phone)}
              required
            />
            {shippingErrors.phone && (
              <span style={{ color: '#c00', fontSize: '0.875rem' }}>{shippingErrors.phone}</span>
            )}
          </div>

          <div style={fieldStyle}>
            <label htmlFor="sh-street" style={labelStyle}>Street Address *</label>
            <input
              id="sh-street"
              type="text"
              value={form.values.shippingAddress.streetAddress}
              onChange={(e) =>
                form.setFieldValue('shippingAddress', {
                  ...form.values.shippingAddress,
                  streetAddress: e.target.value,
                })
              }
              style={inputStyle(!!shippingErrors.streetAddress)}
              required
            />
            {shippingErrors.streetAddress && (
              <span style={{ color: '#c00', fontSize: '0.875rem' }}>{shippingErrors.streetAddress}</span>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={fieldStyle}>
              <label htmlFor="sh-city" style={labelStyle}>City *</label>
              <input
                id="sh-city"
                type="text"
                value={form.values.shippingAddress.city}
                onChange={(e) =>
                  form.setFieldValue('shippingAddress', {
                    ...form.values.shippingAddress,
                    city: e.target.value,
                  })
                }
                style={inputStyle(!!shippingErrors.city)}
                required
              />
              {shippingErrors.city && (
                <span style={{ color: '#c00', fontSize: '0.875rem' }}>{shippingErrors.city}</span>
              )}
            </div>
            <div style={fieldStyle}>
              <label htmlFor="sh-state" style={labelStyle}>State *</label>
              <input
                id="sh-state"
                type="text"
                value={form.values.shippingAddress.state}
                onChange={(e) =>
                  form.setFieldValue('shippingAddress', {
                    ...form.values.shippingAddress,
                    state: e.target.value,
                  })
                }
                style={inputStyle(!!shippingErrors.state)}
                required
              />
              {shippingErrors.state && (
                <span style={{ color: '#c00', fontSize: '0.875rem' }}>{shippingErrors.state}</span>
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={fieldStyle}>
              <label htmlFor="sh-postal" style={labelStyle}>Postal Code *</label>
              <input
                id="sh-postal"
                type="text"
                value={form.values.shippingAddress.postalCode}
                onChange={(e) =>
                  form.setFieldValue('shippingAddress', {
                    ...form.values.shippingAddress,
                    postalCode: e.target.value,
                  })
                }
                style={inputStyle(!!shippingErrors.postalCode)}
                required
              />
              {shippingErrors.postalCode && (
                <span style={{ color: '#c00', fontSize: '0.875rem' }}>{shippingErrors.postalCode}</span>
              )}
            </div>
            <div style={fieldStyle}>
              <label htmlFor="sh-country" style={labelStyle}>Country *</label>
              <input
                id="sh-country"
                type="text"
                value={form.values.shippingAddress.country}
                onChange={(e) =>
                  form.setFieldValue('shippingAddress', {
                    ...form.values.shippingAddress,
                    country: e.target.value,
                  })
                }
                style={inputStyle(!!shippingErrors.country)}
                required
              />
              {shippingErrors.country && (
                <span style={{ color: '#c00', fontSize: '0.875rem' }}>{shippingErrors.country}</span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setCurrentStep(2)}
            style={{
              padding: '0.5rem 1.5rem',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '0.5rem',
            }}
          >
            Next: Billing →
          </button>
        </div>
      )}

      {/* Step 2: Billing Address */}
      {currentStep === 2 && (
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginTop: 0 }}>Billing Address</h3>
          <label style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
            <input
              type="checkbox"
              name="sameAsShipping"
              checked={form.values.sameAsShipping}
              onChange={(e) => form.setFieldValue('sameAsShipping', e.target.checked)}
              style={{ marginRight: '0.5rem' }}
            />
            Same as shipping address
          </label>

          {!form.values.sameAsShipping && (
            <p style={{ color: '#666', fontStyle: 'italic' }}>
              Billing address fields would appear here when "same as shipping" is unchecked.
            </p>
          )}

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              style={{
                padding: '0.5rem 1.5rem',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              style={{
                padding: '0.5rem 1.5rem',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Next: Payment →
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Payment */}
      {currentStep === 3 && (
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginTop: 0 }}>Payment Method</h3>

          <div style={fieldStyle}>
            <label htmlFor="paymentMethod" style={labelStyle}>
              Select Payment Method *
            </label>
            <select
              id="paymentMethod"
              name="paymentMethod"
              value={form.values.paymentMethod}
              onChange={(e) => form.setFieldValue('paymentMethod', e.target.value)}
              style={inputStyle(false)}
              required
            >
              <option value="credit-card">Credit Card</option>
              <option value="debit-card">Debit Card</option>
              <option value="paypal">PayPal</option>
              <option value="bank-transfer">Bank Transfer</option>
            </select>
          </div>

          {(form.values.paymentMethod === 'credit-card' ||
            form.values.paymentMethod === 'debit-card') && (
            <>
              <div style={fieldStyle}>
                <label htmlFor="cardNumber" style={labelStyle}>Card Number *</label>
                <input
                  id="cardNumber"
                  type="text"
                  name="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={form.values.cardNumber}
                  onChange={form.handleChange}
                  style={inputStyle(!!form.errors.cardNumber)}
                  maxLength={19}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={fieldStyle}>
                  <label htmlFor="cardExpiry" style={labelStyle}>Expiry *</label>
                  <input
                    id="cardExpiry"
                    type="text"
                    name="cardExpiry"
                    placeholder="MM/YY"
                    value={form.values.cardExpiry}
                    onChange={form.handleChange}
                    style={inputStyle(!!form.errors.cardExpiry)}
                    maxLength={5}
                  />
                </div>
                <div style={fieldStyle}>
                  <label htmlFor="cardCVV" style={labelStyle}>CVV *</label>
                  <input
                    id="cardCVV"
                    type="text"
                    name="cardCVV"
                    placeholder="123"
                    value={form.values.cardCVV}
                    onChange={form.handleChange}
                    style={inputStyle(!!form.errors.cardCVV)}
                    maxLength={4}
                  />
                </div>
              </div>
            </>
          )}

          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              style={{
                padding: '0.5rem 1.5rem',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              ← Back
            </button>
            <button
              type="submit"
              style={{
                flex: 1,
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
        </div>
      )}
    </form>
  );
});

CheckoutForm.displayName = 'CheckoutForm';
