import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

// INTERCEPTOR REQUEST: tu dong gan token vao moi request.
// Nho no, khong component nao phai tu nho viec them header Authorization.
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// INTERCEPTOR RESPONSE: xu ly loi tap trung o phia client.
// 401 = token het han hoac khong hop le -> dang xuat va ve trang login.
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      if (window.location.pathname !== '/login') window.location.href = '/login';
    }
    // Lay message that tu backend (do errorHandler tra ve), khong hien loi ky thuat
    const message = error.response?.data?.message || 'Cannot connect to the server';
    return Promise.reject(new Error(message));
  }
);

export default axiosClient;
