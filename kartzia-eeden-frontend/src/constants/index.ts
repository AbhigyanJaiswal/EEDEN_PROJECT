// App Constants

export const APP_NAME = 'Kartzia Eeden';
export const APP_VERSION = '1.0.0';

// API
export const API_TIMEOUT = 30000; // 30 seconds
export const API_BASE_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:3000/api';

// Payment Methods
export const PAYMENT_METHODS = {
  CREDIT_CARD: 'credit-card',
  DEBIT_CARD: 'debit-card',
  PAYPAL: 'paypal',
  BANK_TRANSFER: 'bank-transfer',
} as const;

// Order Status
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  RETURNED: 'returned',
} as const;

// Shipping Methods
export const SHIPPING_METHODS = {
  STANDARD: { id: 'standard', name: 'Standard Shipping', price: 0, days: 5 },
  EXPRESS: { id: 'express', name: 'Express Shipping', price: 10, days: 2 },
  OVERNIGHT: { id: 'overnight', name: 'Overnight Shipping', price: 25, days: 1 },
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  CHECKOUT_FAILED: 'Checkout failed. Please try again.',
  LOGIN_FAILED: 'Login failed. Please check your credentials.',
  SIGNUP_FAILED: 'Signup failed. Please try again.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  SIGNUP_SUCCESS: 'Account created successfully!',
  ORDER_PLACED: 'Order placed successfully!',
  ITEM_ADDED: 'Item added to cart',
  ITEM_REMOVED: 'Item removed from cart',
  ADDRESS_SAVED: 'Address saved successfully',
} as const;

// Validation Rules
export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 2,
  PHONE_MIN_LENGTH: 7,
  POSTAL_CODE_MIN_LENGTH: 4,
} as const;

// Page Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDER_CONFIRMATION: '/order-confirmation',
  ORDERS: '/orders',
  PROFILE: '/profile',
  NOT_FOUND: '/404',
} as const;

// Pagination
export const PAGINATION = {
  ITEMS_PER_PAGE: 20,
  MAX_PAGES: 100,
} as const;

// Cache Duration (in milliseconds)
export const CACHE_DURATION = {
  SHORT: 5 * 60 * 1000, // 5 minutes
  MEDIUM: 30 * 60 * 1000, // 30 minutes
  LONG: 24 * 60 * 60 * 1000, // 24 hours
} as const;
