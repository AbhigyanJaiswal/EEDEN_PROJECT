import React, { useState, memo, useCallback } from 'react';
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

const FieldError: React.FC<{ msg?: string }> = ({ msg }) =>
  msg ? (
    <span role="alert" style={{ color: '#c00', fontSize: '0.875rem', display: 'block', marginTop: '0.25rem' }}>
      {msg}
    </span>
  ) : null;

// FIX: returns true only if all required shipping fields are non-empty
const isShippingComplete = (addr: CheckoutFormData['shippingAddress']): boolean =>
  !!(addr.fullName && addr.phone && addr.streetAddress && addr.city && addr.state && addr.postalCode && addr.country);

export const CheckoutForm: React.FC<CheckoutFormProps> = memo(({ onSuccess }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<CheckoutFormData>(
    {
      shippingAddress: { fullName: '', phone: '', streetAddress: '', city: '', state: '', postalCode: '', country: '' },
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
          throw new Error(result.error ?? 'Checkout failed');
        }
        const data = result.data as { orderId: string };
        onSuccess?.(data.orderId);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Checkout failed';
        setSubmitError(message);
      }
    }
  );

  const shippingErrs = (form.errors as Record<string, Record<string, string>>).shippingAddress ?? {};
  const isCardPayment = form.values.paymentMethod === 'credit-card' || form.values.paymentMethod === 'debit-card';

  // FIX: guard step navigation — only allow going forward when current step is valid
  const canGoToStep2 = isShippingComplete(form.values.shippingAddress);
  const canGoToStep3 = true; // billing is optional (sameAsShipping default)

  const handleStepClick = useCallback((step: number) => {
    // Allow going backwards freely; only allow forward if current step is complete
    if (step < currentStep) {
      setCurrentStep(step);
    } else if (step === 2 && canGoToStep2) {
      setCurrentStep(2);
    } else if (step === 3 && canGoToStep2 && canGoToStep3) {
      setCurrentStep(3);
    }
  }, [currentStep, canGoToStep2, canGoToStep3]);

  const handleNext = useCallback(() => {
    if (currentStep === 1 && canGoToStep2) setCurrentStep(2);
    if (currentStep === 2 && canGoToStep3) setCurrentStep(3);
  }, [currentStep, canGoToStep2, canGoToStep3]);

  const handleBack = useCallback(() => {
    if (currentStep > 1) setCurrentStep((s) => s - 1);
  }, [currentStep]);

  if (form.isSubmitting) {
    return <LoadingState message="Processing your order..." />;
  }

  const stepLabels = ['Shipping', 'Billing', 'Payment'];

  return (
    <form onSubmit={form.handleSubmit()} noValidate aria-label="Checkout form">
      {submitError && <ErrorState message={submitError} />}

      {/* Step indicator */}
      <nav aria-label="Checkout steps" style={{ display: 'flex', marginBottom: '1.5rem', gap: '4px' }}>
        {[1, 2, 3].map((step) => {
          const isActive = currentStep === step;
          const isDone = currentStep > step;
          // FIX: disable forward steps that can't be reached yet
          const isReachable = step <= currentStep ||
            (step === 2 && canGoToStep2) ||
            (step === 3 && canGoToStep2 && canGoToStep3);
          return (
            <button
              key={step}
              type="button"
              onClick={() => handleStepClick(step)}
              disabled={!isReachable}
              aria-current={isActive ? 'step' : undefined}
              style={{
                flex: 1, padding: '0.6rem 0.5rem',
                backgroundColor: isActive ? '#007bff' : isDone ? '#28a745' : '#ddd',
                color: isActive || isDone ? 'white' : '#555',
                border: 'none', borderRadius: '4px',
                cursor: isReachable ? 'pointer' : 'not-allowed',
                fontWeight: isActive ? 'bold' : 'normal',
                fontSize: '0.9rem',
                opacity: isReachable ? 1 : 0.5,
                transition: 'opacity 0.2s',
              }}
            >
              {isDone ? '✓ ' : ''}{stepLabels[step - 1]}
            </button>
          );
        })}
      </nav>

      {/* Step 1: Shipping */}
      {currentStep === 1 && (
        <div>
          <h3 style={{ marginTop: 0 }}>Shipping Address</h3>

          <div style={fieldStyle}>
            <label htmlFor="sh-fullName" style={labelStyle}>Full Name *</label>
            <input id="sh-fullName" type="text" autoComplete="name"
              value={form.values.shippingAddress.fullName}
              onChange={(e) => form.setFieldValue('shippingAddress', { ...form.values.shippingAddress, fullName: e.target.value })}
              style={inputStyle(!!shippingErrs.fullName)} />
            <FieldError msg={shippingErrs.fullName} />
          </div>

          <div style={fieldStyle}>
            <label htmlFor="sh-phone" style={labelStyle}>Phone *</label>
            <input id="sh-phone" type="tel" autoComplete="tel"
              value={form.values.shippingAddress.phone}
              onChange={(e) => form.setFieldValue('shippingAddress', { ...form.values.shippingAddress, phone: e.target.value })}
              style={inputStyle(!!shippingErrs.phone)} />
            <FieldError msg={shippingErrs.phone} />
          </div>

          <div style={fieldStyle}>
            <label htmlFor="sh-street" style={labelStyle}>Street Address *</label>
            <input id="sh-street" type="text" autoComplete="street-address"
              value={form.values.shippingAddress.streetAddress}
              onChange={(e) => form.setFieldValue('shippingAddress', { ...form.values.shippingAddress, streetAddress: e.target.value })}
              style={inputStyle(!!shippingErrs.streetAddress)} />
            <FieldError msg={shippingErrs.streetAddress} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {[
              { id: 'sh-city', field: 'city' as const, label: 'City', ac: 'address-level2' },
              { id: 'sh-state', field: 'state' as const, label: 'State', ac: 'address-level1' },
              { id: 'sh-postal', field: 'postalCode' as const, label: 'Postal Code', ac: 'postal-code' },
              { id: 'sh-country', field: 'country' as const, label: 'Country', ac: 'country-name' },
            ].map(({ id, field, label, ac }) => (
              <div key={field} style={fieldStyle}>
                <label htmlFor={id} style={labelStyle}>{label} *</label>
                <input id={id} type="text" autoComplete={ac}
                  value={form.values.shippingAddress[field]}
                  onChange={(e) => form.setFieldValue('shippingAddress', { ...form.values.shippingAddress, [field]: e.target.value })}
                  style={inputStyle(!!shippingErrs[field])} />
                <FieldError msg={shippingErrs[field]} />
              </div>
            ))}
          </div>

          <button type="button" onClick={handleNext}
            disabled={!canGoToStep2}
            style={{
              padding: '0.6rem 1.5rem', backgroundColor: canGoToStep2 ? '#007bff' : '#aaa',
              color: 'white', border: 'none', borderRadius: '4px',
              cursor: canGoToStep2 ? 'pointer' : 'not-allowed', marginTop: '0.5rem',
            }}>
            Next: Billing →
          </button>
        </div>
      )}

      {/* Step 2: Billing */}
      {currentStep === 2 && (
        <div>
          <h3 style={{ marginTop: 0 }}>Billing Address</h3>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={form.values.sameAsShipping}
              onChange={(e) => form.setFieldValue('sameAsShipping', e.target.checked)} />
            Same as shipping address
          </label>
          {!form.values.sameAsShipping && (
            <p style={{ color: '#666', fontStyle: 'italic', marginBottom: '1rem' }}>
              Billing address fields would appear here.
            </p>
          )}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="button" onClick={handleBack}
              style={{ padding: '0.6rem 1.5rem', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              ← Back
            </button>
            <button type="button" onClick={handleNext}
              style={{ padding: '0.6rem 1.5rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Next: Payment →
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Payment */}
      {currentStep === 3 && (
        <div>
          <h3 style={{ marginTop: 0 }}>Payment Method</h3>

          <div style={fieldStyle}>
            <label htmlFor="paymentMethod" style={labelStyle}>Select Payment Method *</label>
            <select id="paymentMethod" value={form.values.paymentMethod}
              onChange={(e) => form.setFieldValue('paymentMethod', e.target.value)}
              style={inputStyle(false)}>
              <option value="credit-card">Credit Card</option>
              <option value="debit-card">Debit Card</option>
              <option value="paypal">PayPal</option>
              <option value="bank-transfer">Bank Transfer</option>
            </select>
          </div>

          {isCardPayment && (
            <div>
              <div style={fieldStyle}>
                <label htmlFor="cardNumber" style={labelStyle}>Card Number *</label>
                <input id="cardNumber" type="text" name="cardNumber"
                  inputMode="numeric" autoComplete="cc-number" maxLength={19}
                  placeholder="1234 5678 9012 3456"
                  value={form.values.cardNumber ?? ''}
                  onChange={(e) => {
                    // Auto-format into groups of 4
                    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
                    const formatted = raw.replace(/(.{4})/g, '$1 ').trim();
                    form.setFieldValue('cardNumber', formatted);
                  }}
                  style={inputStyle(!!form.errors.cardNumber && !!form.touched.cardNumber)} />
                {/* FIX: show inline error for card number */}
                <FieldError msg={form.touched.cardNumber ? form.errors.cardNumber : undefined} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={fieldStyle}>
                  <label htmlFor="cardExpiry" style={labelStyle}>Expiry (MM/YY) *</label>
                  <input id="cardExpiry" type="text" name="cardExpiry"
                    inputMode="numeric" autoComplete="cc-exp" maxLength={5}
                    placeholder="MM/YY"
                    value={form.values.cardExpiry ?? ''}
                    onChange={(e) => {
                      let v = e.target.value.replace(/\D/g, '').slice(0, 4);
                      if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2);
                      form.setFieldValue('cardExpiry', v);
                    }}
                    style={inputStyle(!!form.errors.cardExpiry && !!form.touched.cardExpiry)} />
                  {/* FIX: show inline error for expiry */}
                  <FieldError msg={form.touched.cardExpiry ? form.errors.cardExpiry : undefined} />
                </div>

                <div style={fieldStyle}>
                  <label htmlFor="cardCVV" style={labelStyle}>CVV *</label>
                  <input id="cardCVV" type="text" name="cardCVV"
                    inputMode="numeric" autoComplete="cc-csc" maxLength={4}
                    placeholder="123"
                    value={form.values.cardCVV ?? ''}
                    onChange={(e) => {
                      form.setFieldValue('cardCVV', e.target.value.replace(/\D/g, '').slice(0, 4));
                    }}
                    style={inputStyle(!!form.errors.cardCVV && !!form.touched.cardCVV)} />
                  {/* FIX: show inline error for CVV */}
                  <FieldError msg={form.touched.cardCVV ? form.errors.cardCVV : undefined} />
                </div>
              </div>

              <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '1rem' }}>
                🔒 Your payment information is encrypted and secure.
              </p>
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={handleBack}
              style={{ padding: '0.6rem 1.5rem', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              ← Back
            </button>
            <button type="submit"
              style={{ flex: 1, padding: '0.75rem', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold' }}
              aria-busy={form.isSubmitting}>
              🔒 Place Order
            </button>
          </div>
        </div>
      )}
    </form>
  );
});

CheckoutForm.displayName = 'CheckoutForm';
