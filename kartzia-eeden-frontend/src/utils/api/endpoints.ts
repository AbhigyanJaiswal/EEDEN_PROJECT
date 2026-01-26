import { apiClient, ApiResponse } from './client';

export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post<{ token: string; user: unknown }>('/auth/login', { email, password }),

  signup: (data: { email: string; password: string; firstName: string; lastName: string }) =>
    apiClient.post<{ token: string; user: unknown }>('/auth/signup', data),

  logout: () => apiClient.post<null>('/auth/logout', {}),

  getProfile: () => apiClient.get<unknown>('/auth/profile'),

  updateProfile: (data: unknown) => apiClient.put<unknown>('/auth/profile', data),
};

export const cartApi = {
  getCart: () => apiClient.get<unknown>('/cart'),

  addItem: (productId: string, quantity: number) =>
    apiClient.post<unknown>('/cart/items', { productId, quantity }),

  updateItem: (itemId: string, quantity: number) =>
    apiClient.put<unknown>(`/cart/items/${itemId}`, { quantity }),

  removeItem: (itemId: string) => apiClient.delete<unknown>(`/cart/items/${itemId}`),

  clearCart: () => apiClient.post<unknown>('/cart/clear', {}),
};

export const orderApi = {
  createOrder: (data: unknown) => apiClient.post<unknown>('/orders', data),

  getOrder: (orderId: string) => apiClient.get<unknown>(`/orders/${orderId}`),

  getOrders: () => apiClient.get<unknown>('/orders'),

  updateOrderStatus: (orderId: string, status: string) =>
    apiClient.put<unknown>(`/orders/${orderId}/status`, { status }),
};

export const addressApi = {
  getAddresses: () => apiClient.get<unknown>('/addresses'),

  addAddress: (data: unknown) => apiClient.post<unknown>('/addresses', data),

  updateAddress: (addressId: string, data: unknown) =>
    apiClient.put<unknown>(`/addresses/${addressId}`, data),

  deleteAddress: (addressId: string) => apiClient.delete<unknown>(`/addresses/${addressId}`),

  setDefault: (addressId: string) =>
    apiClient.put<unknown>(`/addresses/${addressId}/default`, {}),
};
