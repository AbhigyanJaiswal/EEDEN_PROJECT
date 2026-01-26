import React, { useState } from 'react';
import { validate } from '@utils/validation/validator';
import { addressSchema, AddressInput } from '@utils/validation/schemas';
import { addressApi } from '@utils/api/endpoints';
import { ErrorState } from '@components/shared/errors/ErrorState';

interface AddressFormProps {
  onSuccess?: (addressId: string) => void;
  onCancel?: () => void;
}

export const AddressForm: React.FC<AddressFormProps> = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    isDefault: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checkedValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: checkedValue }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    const validation = validate<AddressInput>(addressSchema, formData);
    if (!validation.success) {
      setErrors(validation.errors || {});
      return;
    }

    setIsLoading(true);
    const response = await addressApi.addAddress(validation.data);

    if (response.success) {
      onSuccess?.(formData.street); // Using street as ID for simplicity
    } else {
      setApiError(response.error?.message || 'Failed to save address');
    }
    setIsLoading(false);
  };

  if (apiError) {
    return (
      <ErrorState
        message={apiError}
        retry={() => setApiError(null)}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="address-form" noValidate>
      <h2>Shipping Address</h2>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input
            id="firstName"
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            disabled={isLoading}
            required
          />
          {errors.firstName && <span className="error-message">{errors.firstName}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input
            id="lastName"
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            disabled={isLoading}
            required
          />
          {errors.lastName && <span className="error-message">{errors.lastName}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={isLoading}
            required
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input
            id="phone"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            disabled={isLoading}
            required
          />
          {errors.phone && <span className="error-message">{errors.phone}</span>}
        </div>
      </div>

      <div className="form-group full">
        <label htmlFor="street">Street Address</label>
        <input
          id="street"
          type="text"
          name="street"
          value={formData.street}
          onChange={handleChange}
          disabled={isLoading}
          required
        />
        {errors.street && <span className="error-message">{errors.street}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="city">City</label>
          <input
            id="city"
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            disabled={isLoading}
            required
          />
          {errors.city && <span className="error-message">{errors.city}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="state">State</label>
          <input
            id="state"
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            disabled={isLoading}
            required
          />
          {errors.state && <span className="error-message">{errors.state}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="zipCode">ZIP Code</label>
          <input
            id="zipCode"
            type="text"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
            disabled={isLoading}
            required
          />
          {errors.zipCode && <span className="error-message">{errors.zipCode}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="country">Country</label>
          <input
            id="country"
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            disabled={isLoading}
            required
          />
          {errors.country && <span className="error-message">{errors.country}</span>}
        </div>
      </div>

      <div className="form-group checkbox">
        <input
          id="isDefault"
          type="checkbox"
          name="isDefault"
          checked={formData.isDefault}
          onChange={handleChange}
          disabled={isLoading}
        />
        <label htmlFor="isDefault">Set as default address</label>
      </div>

      <div className="form-actions">
        <button type="submit" disabled={isLoading} aria-busy={isLoading}>
          {isLoading ? 'Saving...' : 'Save Address'}
        </button>
        {onCancel && <button type="button" onClick={onCancel} disabled={isLoading}>
          Cancel
        </button>}
      </div>
    </form>
  );
};
