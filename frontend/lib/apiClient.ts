// ApiClient.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080',
  withCredentials: true, // Send cookies automatically
});

let isRefreshing = false;
let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (error: unknown) => void;
}[] = [];

const processQueue = (error: unknown, token: null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {

    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Wait for ongoing refresh to finish
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          return apiClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call refresh endpoint; expects new tokens as HttpOnly cookies from backend
        console.log('refreshing')
        await axios.get(`${apiClient.defaults.baseURL}/refresh-token`, { withCredentials: true });
        console.log('continue')
        processQueue(null);
        return apiClient(originalRequest); // Retry original request with new cookies sent automatically
      } catch (refreshError) {
        processQueue(refreshError);
        // Optionally handle logout here or propagate error
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
