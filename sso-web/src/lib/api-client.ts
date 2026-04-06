import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/store/auth-store';
import type { AppError } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/v1';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().clearAuth();
      window.location.href = '/login';
    }
    throw mapApiError(error);
  },
);

function mapApiError(error: AxiosError): AppError {
  const appError: AppError = {
    message: 'An error occurred',
    statusCode: error.response?.status,
  };

  if (error.response?.status === 401) {
    appError.message = 'Unauthorized';
  } else if (error.response?.status === 403) {
    appError.message = 'Forbidden';
  } else if (error.response?.status === 404) {
    appError.message = 'Not found';
  } else if (error.response?.status === 422) {
    appError.message = 'Validation error';
    appError.details = error.response?.data;
  } else if (error.response?.data) {
    appError.message = (error.response.data as Record<string, unknown>).message as string || 'An error occurred';
  } else if (error.message) {
    appError.message = error.message;
  }

  return appError;
}

export async function apiGet<T>(url: string): Promise<T> {
  const response = await apiClient.get<T>(url);
  return response.data;
}

export async function apiPost<T>(url: string, data?: unknown): Promise<T> {
  const response = await apiClient.post<T>(url, data);
  return response.data;
}

export async function apiPatch<T>(url: string, data?: unknown): Promise<T> {
  const response = await apiClient.patch<T>(url, data);
  return response.data;
}

export async function apiDelete<T = void>(url: string): Promise<T> {
  const response = await apiClient.delete<T>(url);
  return response.data;
}
