import { apiClient, ApiResponse } from './client';

export const otpAuthApi = {
  requestOtp: (email: string, mode: 'login' | 'signup') =>
    apiClient.post<{ message: string }>('/auth/request-otp', { email, mode }),

  verifyOtp: (email: string, otp: string) =>
    apiClient.post<{ token: string; user: unknown }>('/auth/verify-otp', { email, otp }),

  resendOtp: (email: string) =>
    apiClient.post<{ message: string }>('/auth/resend-otp', { email }),
};
