import axios from 'axios';

export const api = axios.create({
  baseURL: '/api',
  timeout: 100000, // 100s — itinerary drafting can take 60-90s
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ts_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      window.dispatchEvent(new CustomEvent('ts:session-expired'));
    }
    return Promise.reject(err);
  }
);

export type ApiError = {
  message: string;
  code?: string;
  status?: number;
};

export function extractError(err: unknown): string {
  if (axios.isAxiosError(err)) {
    return (
      err.response?.data?.error?.message ??
      err.response?.data?.message ??
      err.message
    );
  }
  if (err instanceof Error) return err.message;
  return 'Something went wrong';
}
