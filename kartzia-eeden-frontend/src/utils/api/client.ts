import { getStoredToken } from '../../context/authStore';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Single source of truth — reads from env, falls back to localhost
const API_BASE_URL = (import.meta as { env: Record<string, string> }).env.VITE_API_URL ?? 'http://localhost:3000/api';

const REQUEST_TIMEOUT_MS = 30_000;

class ApiClient {
  private readonly baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    // FIX: use shared getStoredToken() — never call localStorage directly here
    const token = getStoredToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'GET',
        headers: this.getHeaders(),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        credentials: 'same-origin',
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError<T>(error);
    }
  }

  async post<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: data !== undefined ? JSON.stringify(data) : undefined,
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        credentials: 'same-origin',
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError<T>(error);
    }
  }

  async put<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: data !== undefined ? JSON.stringify(data) : undefined,
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        credentials: 'same-origin',
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError<T>(error);
    }
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        credentials: 'same-origin',
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError<T>(error);
    }
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    // 401 — token expired or invalid: auto-logout
    if (response.status === 401) {
      const { useAuthStore } = await import('../../context/authStore');
      useAuthStore.getState().logout();
      return { success: false, error: 'Session expired. Please log in again.' };
    }

    if (!response.ok) {
      const body = await response.json().catch(() => ({})) as Record<string, unknown>;
      return {
        success: false,
        error: (body['message'] as string | undefined) ?? `HTTP Error: ${response.status}`,
      };
    }

    if (response.status === 204) {
      return { success: true };
    }

    const data = (await response.json()) as T;
    return { success: true, data };
  }

  private handleError<T>(error: unknown): ApiResponse<T> {
    if (error instanceof DOMException && error.name === 'TimeoutError') {
      return { success: false, error: 'Request timed out. Please try again.' };
    }
    if (error instanceof DOMException && error.name === 'AbortError') {
      return { success: false, error: 'Request was cancelled.' };
    }
    const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return { success: false, error: message };
  }
}

export const apiClient = new ApiClient();
