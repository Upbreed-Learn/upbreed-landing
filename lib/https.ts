import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 20000, // 20 seconds
});

axiosInstance.interceptors.request.use(async config => {
  if (config.url === '/') {
    return config;
  }

  const res = await fetch('/api/auth/token');
  const resData = await res.json();
  const token = resData?.token;

  config.headers!['Authorization'] = 'Bearer ' + token;
  axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + token;

  return config;
});

// Response interceptor to handle different error types
axiosInstance.interceptors.response.use(
  response => {
    // Debug logging for successful responses

    return response;
  },
  error => {
    // Debug logging for error responses
    console.error('API Response Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      baseURL: error.config?.baseURL,
      fullURL: `${error.config?.baseURL}${error.config?.url}`,
      data: error.response?.data,
      message: error.message,
    });

    return Promise.reject(error);
  },
);

const https = axiosInstance;

export { https };
