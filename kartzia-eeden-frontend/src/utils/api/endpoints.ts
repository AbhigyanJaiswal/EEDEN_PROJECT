import { apiClient } from './client';
import { User } from '../../context/authStore';

// Auth Endpoints
export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post<{ user: User; token: string }>('/auth/login', { email, password }),

  signup: (email: string, password: string, name: string) =>
    apiClient.post<{ user: User; token: string }>('/auth/signup', { email, password, name }),

  getCurrentUser: () =>
    apiClient.get<User>('/auth/me'),

  logout: () =>
    apiClient.post('/auth/logout'),
};

// Cart Endpoints
export const cartApi = {
  getCart: () =>
    apiClient.get('/cart'),

  addToCart: (productId: string, quantity: number) =>
    apiClient.post('/cart/items', { productId, quantity }),

  updateCartItem: (itemId: string, quantity: number) =>
    apiClient.put(`/cart/items/${itemId}`, { quantity }),

  removeFromCart: (itemId: string) =>
    apiClient.delete(`/cart/items/${itemId}`),

  clearCart: () =>
    apiClient.delete('/cart'),
};

// Order Endpoints
export const orderApi = {
  createOrder: (data: unknown) =>
    apiClient.post('/orders', data),

  getOrders: () =>
    apiClient.get('/orders'),

  getOrder: (orderId: string) =>
    apiClient.get(`/orders/${orderId}`),

  updateOrder: (orderId: string, data: unknown) =>
    apiClient.put(`/orders/${orderId}`, data),
};

// Address Endpoints
export const addressApi = {
  getAddresses: () =>
    apiClient.get('/addresses'),

  createAddress: (data: unknown) =>
    apiClient.post('/addresses', data),

  updateAddress: (addressId: string, data: unknown) =>
    apiClient.put(`/addresses/${addressId}`, data),

  deleteAddress: (addressId: string) =>
    apiClient.delete(`/addresses/${addressId}`),

  setDefaultAddress: (addressId: string) =>
    apiClient.post(`/addresses/${addressId}/set-default`),
};

// Product Endpoints
export const productApi = {
  getProducts: () =>
    apiClient.get('/products'),

  getProduct: (productId: string) =>
    apiClient.get(`/products/${productId}`),

  searchProducts: (query: string) =>
    apiClient.get(`/products/search?q=${encodeURIComponent(query)}`),
};
