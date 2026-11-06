import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 20000, // 20 seconds
});

// The login token lives in a secure cookie the browser's code can't read, so it is fetched from
// /api/auth/token. Fetch it once and reuse it (instead of an extra round trip before every request).
const TOKEN_TTL_MS = 5 * 60_000;
let cached: { token: string | null; at: number } | null = null;
let inFlight: Promise<string | null> | null = null;

/** Call after logging in or out so the next request picks up the new token. */
export function resetTokenCache() {
  cached = null;
  inFlight = null;
}

async function currentToken(): Promise<string | null> {
  if (cached && Date.now() - cached.at < TOKEN_TTL_MS && cached.token) return cached.token;
  if (!inFlight) {
    inFlight = fetch('/api/auth/token')
      .then(r => r.json())
      .then(d => (d?.token as string | undefined) ?? null)
      .catch(() => null)
      .then(token => {
        cached = { token, at: Date.now() };
        inFlight = null;
        return token;
      });
  }
  return inFlight;
}

axiosInstance.interceptors.request.use(async config => {
  if (config.url === '/') {
    return config;
  }
  const token = await currentToken();
  if (token) config.headers!['Authorization'] = 'Bearer ' + token;
  else delete config.headers!['Authorization'];
  return config;
});

// Response interceptor to handle different error types
axiosInstance.interceptors.response.use(
  response => {
    // Debug logging for successful responses

    return response;
  },
  error => {
    if (error.response?.status === 401) resetTokenCache();
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
