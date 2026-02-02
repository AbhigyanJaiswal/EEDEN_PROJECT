export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

const API_BASE_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:3000/api';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const token = localStorage.getItem('authToken');
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
        body: data ? JSON.stringify(data) : undefined,
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
        body: data ? JSON.stringify(data) : undefined,
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
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError<T>(error);
    }
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return {
        success: false,
        error: error.message || `HTTP Error: ${response.status}`,
      };
    }

    const data = await response.json();
    return { success: true, data };
  }

  private handleError<T>(error: unknown): ApiResponse<T> {
    const message = error instanceof Error ? error.message : 'An error occurred';
    return { success: false, error: message };
  }
}

export const apiClient = new ApiClient();
