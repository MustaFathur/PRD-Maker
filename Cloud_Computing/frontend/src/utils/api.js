import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  responseType: 'json',
  headers: {
    'Accept': 'application/json, application/pdf'
  },
  withCredentials: true, // Kirim cookie dengan setiap permintaan
});

// Interceptor untuk menangani token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Jika status 401, kemungkinan token habis masa berlaku
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Minta Access Token baru menggunakan Refresh Token
        const { data } = await axios.post('http://localhost:5000/api/auth/refresh-token', {}, { withCredentials: true });
        const newAccessToken = data.accessToken;

        // Tambahkan Access Token baru ke header permintaan
        api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        // Ulangi permintaan asli dengan Access Token baru
        return api(originalRequest);
      } catch (err) {
        console.error('Gagal memperbarui token:', err);
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;