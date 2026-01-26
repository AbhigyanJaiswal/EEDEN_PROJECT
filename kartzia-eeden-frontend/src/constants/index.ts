/**
 * Application Constants
 */

// API
export const API_TIMEOUT = 30000; // 30 seconds

// Checkout
export const CHECKOUT_STEPS = ['shipping', 'payment', 'review'] as const;
export const SHIPPING_COSTS = {
  standard: 5,
  express: 15,
  overnight: 25,
};

// Validation
export const PASSWORD_MIN_LENGTH = 8;
export const PHONE_REGEX = /^[0-9]{10}$/;
export const ZIP_CODE_REGEX = /^[0-9]{6}$/;

// UI
export const DEFAULT_PAGE_SIZE = 20;
export const DEBOUNCE_DELAY = 300;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  VALIDATION_ERROR: 'Please fix the errors and try again.',
  UNAUTHORIZED: 'Please log in to continue.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'Resource not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNKNOWN_ERROR: 'An unexpected error occurred.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'Logged in successfully!',
  SIGNUP: 'Account created successfully!',
  LOGOUT: 'Logged out successfully!',
  ITEM_ADDED: 'Item added to cart',
  ITEM_REMOVED: 'Item removed from cart',
  ADDRESS_SAVED: 'Address saved',
  ORDER_CREATED: 'Order placed successfully!',
};
