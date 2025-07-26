// ApiClient.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';

import { getToken, setToken } from './TokenService'


const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL!,
  withCredentials: true, // Send cookies automatically
});

apiClient.interceptors.request.use((cfg: InternalAxiosRequestConfig) => {
  const token = getToken()
  if (token && token.includes('.')) {          // must look like a JWT
    cfg.headers.Authorization = `Bearer ${token}`;
  } else {
    delete cfg.headers.Authorization;         // ensure we don’t send “Bearer undefined”
  }
  return cfg
})

let isRefreshing = false;
type QueueItem = {
  resolve: (token: string | null) => void
  reject: (error: unknown) => void
}



let failedQueue: QueueItem[] = []

const processQueue = (error: unknown, token: string | null = null) => {
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
          failedQueue.push({ 
            resolve: (token: string | null) => {
            if (token && token.includes('.')) {
              (originalRequest.headers = originalRequest.headers || {}).Authorization =
                `Bearer ${token}`;
            }
            resolve(apiClient(originalRequest));
            }
            , reject });
        })
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call refresh endpoint; expects new tokens as HttpOnly cookies from backend
        console.log('refreshing')
        const { data } = await axios.get<{ accessToken: string}>(
          `${apiClient.defaults.baseURL}/refresh-token`,
          {withCredentials: true}
        )
        const newToken = data.accessToken
        setToken(newToken)
        apiClient.defaults.headers.Authorization = `Bearer ${newToken}`;
        processQueue(null, newToken);
        (originalRequest.headers = originalRequest.headers || {}).Authorization = `Bearer ${newToken}`
        return apiClient(originalRequest)

      } catch (refreshError) {
        processQueue(refreshError);

        // Handle logout

        await axios.post(`${apiClient.defaults.baseURL}/logout`, null, { withCredentials: true })
        window.location.assign("/login?reason=expired_token")
        setToken(null)

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
