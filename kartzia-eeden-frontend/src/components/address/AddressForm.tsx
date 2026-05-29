import React, { memo } from 'react';
import { useForm } from '../../hooks/useForm';
import { addressSchema, type AddressFormData } from '../../utils/validation/schemas';
import { ErrorState } from '../shared/errors/ErrorState';

interface AddressFormProps {
  initialAddress?: Partial<AddressFormData>;
  onSuccess?: (address: AddressFormData) => void;
}

export const AddressForm: React.FC<AddressFormProps> = memo(({ initialAddress, onSuccess }) => {
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const form = useForm<AddressFormData>(
    {
      fullName: initialAddress?.fullName || '',
      phone: initialAddress?.phone || '',
      streetAddress: initialAddress?.streetAddress || '',
      city: initialAddress?.city || '',
      state: initialAddress?.state || '',
      postalCode: initialAddress?.postalCode || '',
      country: initialAddress?.country || '',
      isDefault: initialAddress?.isDefault || false,
    },
    addressSchema,
    async (values) => {
      try {
        setSubmitError(null);
        // API call would go here
        const method = initialAddress?.id ? 'PUT' : 'POST';
        const endpoint = initialAddress?.id ? `/api/addresses/${initialAddress.id}` : '/api/addresses';
        
        const response = await fetch(endpoint, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          throw new Error('Failed to save address');
        }

        const data = await response.json();
        onSuccess?.(data.address);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to save address';
        setSubmitError(message);
      }
    }
  );

  return (
    <form onSubmit={form.handleSubmit()} noValidate aria-label="Address form">
      {submitError && <ErrorState message={submitError} />}

      <div className="form-group" style={{ marginBottom: '1rem' }}>
        <label htmlFor="fullName" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
          Full Name *
        </label>
        <input
          id="fullName"
          type="text"
          name="fullName"
          value={form.values.fullName}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          style={{
            width: '100%',
            padding: '0.5rem',
            borderRadius: '4px',
            border: `1px solid ${form.errors.fullName ? '#c00' : '#ccc'}`,
          }}
          required
        />
        {form.errors.fullName && <span style={{ color: '#c00', fontSize: '0.875rem' }}>{form.errors.fullName}</span>}
      </div>

      <div className="form-group" style={{ marginBottom: '1rem' }}>
        <label htmlFor="phone" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
          Phone *
        </label>
        <input
          id="phone"
          type="tel"
          name="phone"
          value={form.values.phone}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          style={{
            width: '100%',
            padding: '0.5rem',
            borderRadius: '4px',
            border: `1px solid ${form.errors.phone ? '#c00' : '#ccc'}`,
          }}
          required
        />
        {form.errors.phone && <span style={{ color: '#c00', fontSize: '0.875rem' }}>{form.errors.phone}</span>}
      </div>

      <div className="form-group" style={{ marginBottom: '1rem' }}>
        <label htmlFor="streetAddress" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
          Street Address *
        </label>
        <input
          id="streetAddress"
          type="text"
          name="streetAddress"
          value={form.values.streetAddress}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          style={{
            width: '100%',
            padding: '0.5rem',
            borderRadius: '4px',
            border: `1px solid ${form.errors.streetAddress ? '#c00' : '#ccc'}`,
          }}
          required
        />
        {form.errors.streetAddress && <span style={{ color: '#c00', fontSize: '0.875rem' }}>{form.errors.streetAddress}</span>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <div className="form-group">
          <label htmlFor="city" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
            City *
          </label>
          <input
            id="city"
            type="text"
            name="city"
            value={form.values.city}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            style={{
              width: '100%',
              padding: '0.5rem',
              borderRadius: '4px',
              border: `1px solid ${form.errors.city ? '#c00' : '#ccc'}`,
            }}
            required
          />
          {form.errors.city && <span style={{ color: '#c00', fontSize: '0.875rem' }}>{form.errors.city}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="state" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
            State *
          </label>
          <input
            id="state"
            type="text"
            name="state"
            value={form.values.state}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            style={{
              width: '100%',
              padding: '0.5rem',
              borderRadius: '4px',
              border: `1px solid ${form.errors.state ? '#c00' : '#ccc'}`,
            }}
            required
          />
          {form.errors.state && <span style={{ color: '#c00', fontSize: '0.875rem' }}>{form.errors.state}</span>}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <div className="form-group">
          <label htmlFor="postalCode" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
            Postal Code *
          </label>
          <input
            id="postalCode"
            type="text"
            name="postalCode"
            value={form.values.postalCode}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            style={{
              width: '100%',
              padding: '0.5rem',
              borderRadius: '4px',
              border: `1px solid ${form.errors.postalCode ? '#c00' : '#ccc'}`,
            }}
            required
          />
          {form.errors.postalCode && <span style={{ color: '#c00', fontSize: '0.875rem' }}>{form.errors.postalCode}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="country" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
            Country *
          </label>
          <input
            id="country"
            type="text"
            name="country"
            value={form.values.country}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            style={{
              width: '100%',
              padding: '0.5rem',
              borderRadius: '4px',
              border: `1px solid ${form.errors.country ? '#c00' : '#ccc'}`,
            }}
            required
          />
          {form.errors.country && <span style={{ color: '#c00', fontSize: '0.875rem' }}>{form.errors.country}</span>}
        </div>
      </div>

      <label style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
        <input
          type="checkbox"
          name="isDefault"
          checked={form.values.isDefault || false}
          onChange={(e) => form.setFieldValue('isDefault', e.target.checked)}
          style={{ marginRight: '0.5rem' }}
        />
        Set as default address
      </label>

      <button
        type="submit"
        disabled={form.isSubmitting}
        style={{
          width: '100%',
          padding: '0.75rem',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontSize: '1rem',
          fontWeight: 500,
          cursor: form.isSubmitting ? 'not-allowed' : 'pointer',
          opacity: form.isSubmitting ? 0.7 : 1,
        }}
        aria-busy={form.isSubmitting}
      >
        {form.isSubmitting ? 'Saving...' : 'Save Address'}
      </button>
    </form>
  );
});

AddressForm.displayName = 'AddressForm';
