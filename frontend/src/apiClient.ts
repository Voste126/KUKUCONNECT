// frontend/src/apiClient.ts

import axios from 'axios';
import BASE_URL from './config';

const apiClient = axios.create({
  baseURL: BASE_URL,
});

// Request Interceptor:
// This function automatically attaches the access token to every
// request's Authorization header, so you don't have to do it manually.
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor:
// This is the magic. It "catches" 401 errors and tries to refresh
// the token, then retries the original request.
apiClient.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is 401 (Unauthorized) and we haven't retried yet
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark this request as retried
      
      const refreshToken = localStorage.getItem('refreshToken');

      if (refreshToken) {
        try {
          // Make a request to the refresh token endpoint
          const rs = await axios.post(`${BASE_URL}/api/users/token/refresh/`, {
            refresh: refreshToken,
          });

          const { access } = rs.data;

          // Update the new access token in localStorage
          localStorage.setItem('accessToken', access);

          // Update the authorization header for this request and for future requests
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${access}`;
          originalRequest.headers['Authorization'] = `Bearer ${access}`;
          
          // Retry the original request with the new token
          return apiClient(originalRequest);
        } catch (_error) {
          // If refresh fails (e.g., refresh token is also expired),
          // clear tokens and redirect to login.
          console.error("Token refresh failed", _error);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login'; // Force redirect
          return Promise.reject(_error);
        }
      }
    }
    
    // For any other errors, just reject the promise
    return Promise.reject(error);
  }
);

export default apiClient;