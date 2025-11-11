import axios, { AxiosError } from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3002/api";

// Central axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  // We use Authorization header (Bearer token), not cookies
  withCredentials: false,
});

// Optional token interceptor (token stored in localStorage/session)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Optionally dispatch logout or redirect
    }
    return Promise.reject(error);
  }
);

export type ApiSuccess<T> = {
  success: true;
  data: T;
};

export type ApiError = {
  success: false;
  error: string;
  details?: unknown;
};

export async function apiGet<T = unknown>(path: string): Promise<T> {
  const { data } = await api.get<T>(path);
  return data;
}

export async function apiPost<R = unknown, B = unknown>(
  path: string,
  body: B
): Promise<R> {
  const { data } = await api.post<R>(path, body);
  return data;
}

export async function apiPut<R = unknown, B = unknown>(
  path: string,
  body: B
): Promise<R> {
  const { data } = await api.put<R>(path, body);
  return data;
}

export async function apiDelete<R = unknown>(path: string): Promise<R> {
  const { data } = await api.delete<R>(path);
  return data;
}

export function extractError(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const e = err as AxiosError;
    const maybeData = e.response?.data as Partial<ApiError> | undefined;
    return maybeData && typeof maybeData.error === "string"
      ? maybeData.error
      : String(e.message);
  }
  if (
    typeof err === "object" &&
    err !== null &&
    "message" in (err as Record<string, unknown>) &&
    typeof (err as Record<string, unknown>).message === "string"
  ) {
    return (err as Record<string, string>).message;
  }
  return String(err);
}
