import axios from 'axios';

const api = axios.create({
  baseURL:'http://localhost:5000/api',
  responseType: 'json',
  headers: {
    'Accept': 'application/json, application/pdf'
  },
  withCredentials: true, // Send cookies with every request
});

// Interceptor to handle token refresh
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // If status 401, token might have expired
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Request a new Access Token using the Refresh Token
        const { data } = await axios.post('http://localhost:5000/api/auth/refresh-token', {}, { withCredentials: true });
        const newAccessToken = data.accessToken;

        // Add the new Access Token to the request headers
        api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        // Retry the original request with the new Access Token
        return api(originalRequest);
      } catch (err) {
        console.error('Failed to refresh token:', err);
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;