// src/lib/api.js
import axios from 'axios';


const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:5001/api",
  withCredentials: true,
});

// after creating the axios instance
api.interceptors.request.use((cfg) => {
  const tok = sessionStorage.getItem('token') || localStorage.getItem('token');
  if (tok) {
    cfg.headers = cfg.headers || {};
    cfg.headers.Authorization = `Bearer ${tok}`;
  }

  // important for uploads:
  if (cfg.data instanceof FormData) {
    if (cfg.headers) {
      delete cfg.headers['Content-Type'];
      delete cfg.headers['content-type'];
    }
  }
  return cfg;
});


// 401 handling
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    const hadAuth = !!err?.config?.headers?.Authorization;

    if (status === 401 && hadAuth) {
      try {
        sessionStorage.removeItem('session_expiry');
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      } catch {}
      // optionally redirect to login here
    }
    return Promise.reject(err);
  }
);

export default api;
