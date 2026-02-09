# Google OAuth Frontend Implementation Guide

This guide provides step-by-step instructions for integrating Google OAuth authentication in your frontend application.

## Overview

The Google OAuth flow involves three main steps:
1. **Initiate OAuth**: Redirect user to the API's Google OAuth endpoint
2. **Google Authentication**: User authenticates with Google
3. **Handle Callback**: Receive authentication token and user data

## API Endpoints

### Base URL
```
Development: http://localhost:3000
Production: https://your-api-domain.com
```

### Endpoints
- **Initiate OAuth**: `GET /auth/google`
- **Callback** (handled automatically): `GET /auth/google/callback`

## Implementation Steps

### Step 1: Create a Device Signature

Generate a unique identifier for the user's device/browser to manage sessions:

```javascript
// Generate or retrieve device signature
function getDeviceSignature() {
  let deviceId = localStorage.getItem('deviceSignature');
  
  if (!deviceId) {
    // Generate a unique device ID
    deviceId = `device-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('deviceSignature', deviceId);
  }
  
  return deviceId;
}
```

### Step 2: Initiate Google OAuth Flow

Create a function to redirect users to the Google OAuth flow:

```javascript
function initiateGoogleLogin(redirectUrl) {
  const apiBaseUrl = 'http://localhost:3000'; // Replace with your API URL
  const deviceSignature = getDeviceSignature();
  
  // Build the OAuth URL with parameters
  const oauthUrl = new URL(`${apiBaseUrl}/auth/google`);
  oauthUrl.searchParams.append('deviceSignature', deviceSignature);
  oauthUrl.searchParams.append('redirectUrl', redirectUrl);
  
  // Redirect to initiate OAuth
  window.location.href = oauthUrl.toString();
}
```

### Step 3: Create a Callback Page

Create a dedicated callback page to handle the OAuth response:

#### Vanilla JavaScript / HTML

```html
<!DOCTYPE html>
<html>
<head>
  <title>Authentication Callback</title>
</head>
<body>
  <div id="loading">Completing authentication...</div>
  
  <script>
    // Extract parameters from URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const userId = urlParams.get('userId');
    const email = urlParams.get('email');
    
    if (token) {
      // Store authentication token
      localStorage.setItem('authToken', token);
      localStorage.setItem('userId', userId);
      localStorage.setItem('userEmail', email);
      
      // Redirect to dashboard or home page
      window.location.href = '/dashboard';
    } else {
      // Handle error
      document.getElementById('loading').innerHTML = 
        'Authentication failed. Please try again.';
    }
  </script>
</body>
</html>
```

#### React Implementation

```jsx
// pages/auth/callback.jsx
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = searchParams.get('token');
    const userId = searchParams.get('userId');
    const email = searchParams.get('email');
    
    if (token) {
      // Store authentication data
      localStorage.setItem('authToken', token);
      localStorage.setItem('userId', userId);
      localStorage.setItem('userEmail', email);
      
      // Redirect to dashboard
      navigate('/dashboard', { replace: true });
    } else {
      // Handle authentication failure
      navigate('/login?error=auth_failed', { replace: true });
    }
  }, [searchParams, navigate]);
  
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="spinner"></div>
        <p className="mt-4">Completing authentication...</p>
      </div>
    </div>
  );
}
```

```jsx
// components/GoogleLoginButton.jsx
import React from 'react';

const GoogleLoginButton = () => {
  const handleGoogleLogin = () => {
    const apiBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';
    const deviceSignature = getDeviceSignature();
    const redirectUrl = `${window.location.origin}/auth/callback`;
    
    const oauthUrl = `${apiBaseUrl}/auth/google?deviceSignature=${encodeURIComponent(deviceSignature)}&redirectUrl=${encodeURIComponent(redirectUrl)}`;
    
    window.location.href = oauthUrl;
  };
  
  const getDeviceSignature = () => {
    let deviceId = localStorage.getItem('deviceSignature');
    if (!deviceId) {
      deviceId = `device-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('deviceSignature', deviceId);
    }
    return deviceId;
  };
  
  return (
    <button 
      onClick={handleGoogleLogin}
      className="flex items-center justify-center gap-2 w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        {/* Google icon SVG path */}
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
      Continue with Google
    </button>
  );
};

export default GoogleLoginButton;
```

#### Vue.js Implementation

```vue
<!-- pages/auth/callback.vue -->
<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="text-center">
      <div class="spinner"></div>
      <p class="mt-4">{{ message }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: 'Completing authentication...'
    }
  },
  mounted() {
    this.handleCallback();
  },
  methods: {
    handleCallback() {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      const userId = urlParams.get('userId');
      const email = urlParams.get('email');
      
      if (token) {
        // Store authentication data
        localStorage.setItem('authToken', token);
        localStorage.setItem('userId', userId);
        localStorage.setItem('userEmail', email);
        
        // Redirect to dashboard
        this.$router.push('/dashboard');
      } else {
        this.message = 'Authentication failed. Please try again.';
        setTimeout(() => {
          this.$router.push('/login');
        }, 2000);
      }
    }
  }
}
</script>
```

```vue
<!-- components/GoogleLoginButton.vue -->
<template>
  <button 
    @click="handleGoogleLogin"
    class="flex items-center justify-center gap-2 w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
  >
    <img src="/google-icon.svg" alt="Google" class="w-5 h-5" />
    Continue with Google
  </button>
</template>

<script>
export default {
  methods: {
    handleGoogleLogin() {
      const apiBaseUrl = process.env.VUE_APP_API_URL || 'http://localhost:3000';
      const deviceSignature = this.getDeviceSignature();
      const redirectUrl = `${window.location.origin}/auth/callback`;
      
      const oauthUrl = `${apiBaseUrl}/auth/google?deviceSignature=${encodeURIComponent(deviceSignature)}&redirectUrl=${encodeURIComponent(redirectUrl)}`;
      
      window.location.href = oauthUrl;
    },
    
    getDeviceSignature() {
      let deviceId = localStorage.getItem('deviceSignature');
      if (!deviceId) {
        deviceId = `device-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('deviceSignature', deviceId);
      }
      return deviceId;
    }
  }
}
</script>
```

#### Next.js Implementation

```typescript
// app/auth/callback/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const token = searchParams.get('token');
    const userId = searchParams.get('userId');
    const email = searchParams.get('email');
    
    if (token) {
      // Store authentication data
      localStorage.setItem('authToken', token);
      localStorage.setItem('userId', userId || '');
      localStorage.setItem('userEmail', email || '');
      
      // Redirect to dashboard
      router.replace('/dashboard');
    } else {
      // Handle authentication failure
      router.replace('/login?error=auth_failed');
    }
  }, [searchParams, router]);
  
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        <p className="mt-4">Completing authentication...</p>
      </div>
    </div>
  );
}
```

```typescript
// components/GoogleLoginButton.tsx
'use client';

import React from 'react';

const GoogleLoginButton = () => {
  const handleGoogleLogin = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const deviceSignature = getDeviceSignature();
    const redirectUrl = `${window.location.origin}/auth/callback`;
    
    const oauthUrl = `${apiBaseUrl}/auth/google?deviceSignature=${encodeURIComponent(deviceSignature)}&redirectUrl=${encodeURIComponent(redirectUrl)}`;
    
    window.location.href = oauthUrl;
  };
  
  const getDeviceSignature = () => {
    let deviceId = localStorage.getItem('deviceSignature');
    if (!deviceId) {
      deviceId = `device-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('deviceSignature', deviceId);
    }
    return deviceId;
  };
  
  return (
    <button 
      onClick={handleGoogleLogin}
      className="flex items-center justify-center gap-2 w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
      Continue with Google
    </button>
  );
};

export default GoogleLoginButton;
```

## Authentication Flow Diagram

```
User                Frontend              API                  Google
 |                     |                   |                     |
 |--Click Login------->|                   |                     |
 |                     |                   |                     |
 |                     |--GET /auth/google-->                    |
 |                     |   + deviceSignature                     |
 |                     |   + redirectUrl                         |
 |                     |                   |                     |
 |                     |                   |--Redirect to------->|
 |                     |                   |   consent screen    |
 |                     |                   |                     |
 |<---------------------------------- Google Login Page ---------|
 |                     |                   |                     |
 |--Login with Google-------------------------------->          |
 |                     |                   |                     |
 |                     |                   |<---User Data--------|
 |                     |                   |                     |
 |                     |                   |--Create/Update------|
 |                     |                   |   User & Session    |
 |                     |                   |                     |
 |<--Redirect to callback with token------|                     |
 |    (redirectUrl?token=xxx&userId=123)  |                     |
 |                     |                   |                     |
 |--Store token------->|                   |                     |
 |--Navigate to dashboard->               |                     |
```

## Using the Authentication Token

After receiving the token, include it in API requests:

### Axios Example

```javascript
import axios from 'axios';

// Create axios instance with auth interceptor
const api = axios.create({
  baseURL: 'http://localhost:3000', // Your API base URL
});

// Add token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - redirect to login
      localStorage.removeItem('authToken');
      localStorage.removeItem('userId');
      localStorage.removeItem('userEmail');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Fetch Example

```javascript
async function fetchProtectedData() {
  const token = localStorage.getItem('authToken');
  
  const response = await fetch('http://localhost:3000/api/protected-route', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  
  if (response.status === 401) {
    // Token expired - redirect to login
    localStorage.clear();
    window.location.href = '/login';
    return;
  }
  
  return await response.json();
}
```

## Environment Variables

Create a `.env` file in your frontend project:

```env
# React / Next.js
REACT_APP_API_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000

# Vue.js
VUE_APP_API_URL=http://localhost:3000

# Production
# REACT_APP_API_URL=https://api.yourapp.com
```

## Security Best Practices

1. **Use HTTPS in Production**: Always use HTTPS for OAuth redirects in production
2. **Validate Redirect URLs**: Whitelist allowed redirect URLs on the backend
3. **Secure Token Storage**: 
   - Consider using `httpOnly` cookies for token storage (requires backend changes)
   - Never expose tokens in URLs (except during the OAuth callback)
4. **Token Expiration**: Implement token refresh logic when tokens expire
5. **Device Signature**: Keep device signatures consistent per device/browser
6. **CSP Headers**: Configure Content Security Policy headers to prevent XSS attacks

## Error Handling

Handle common OAuth errors gracefully:

```javascript
function handleOAuthCallback() {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  const error = urlParams.get('error');
  
  if (error) {
    // Handle specific errors
    const errorMessages = {
      'access_denied': 'You denied access to your Google account.',
      'auth_failed': 'Authentication failed. Please try again.',
      'invalid_device': 'Device validation failed.',
    };
    
    const message = errorMessages[error] || 'An unexpected error occurred.';
    showErrorMessage(message);
    return;
  }
  
  if (!token) {
    showErrorMessage('No authentication token received.');
    return;
  }
  
  // Process successful authentication
  processAuthToken(token);
}
```

## Testing

### Test URLs for Development

```javascript
// Initiate OAuth
http://localhost:3000/auth/google?deviceSignature=test-device&redirectUrl=http://localhost:8080/auth/callback

// Expected callback
http://localhost:8080/auth/callback?token=eyJhbG...&userId=123&email=user@example.com
```

### Testing Checklist

- [ ] OAuth flow initiates correctly
- [ ] User can authenticate with Google
- [ ] Callback receives token and user data
- [ ] Token is stored correctly
- [ ] Protected routes work with token
- [ ] Token expiration is handled
- [ ] Error cases display appropriate messages
- [ ] Device signature persists across sessions
- [ ] Logout clears all stored data

## Complete Working Example

Here's a minimal complete implementation:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Google OAuth Demo</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
    .btn { padding: 12px 24px; border: 1px solid #ddd; border-radius: 4px; cursor: pointer; }
    .btn:hover { background: #f5f5f5; }
    .hidden { display: none; }
  </style>
</head>
<body>
  <div id="login-section">
    <h1>Welcome to Upbreed Learn</h1>
    <button class="btn" onclick="loginWithGoogle()">
      🔐 Sign in with Google
    </button>
  </div>
  
  <div id="dashboard-section" class="hidden">
    <h1>Dashboard</h1>
    <p>Welcome, <span id="user-email"></span>!</p>
    <button class="btn" onclick="logout()">Logout</button>
  </div>

  <script>
    const API_URL = 'http://localhost:3000';
    
    // Check if user is already logged in
    window.onload = function() {
      checkAuth();
    };
    
    function checkAuth() {
      // Check if we're on callback with token
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      
      if (token) {
        // Store token from callback
        const userId = urlParams.get('userId');
        const email = urlParams.get('email');
        
        localStorage.setItem('authToken', token);
        localStorage.setItem('userId', userId);
        localStorage.setItem('userEmail', email);
        
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }
      
      // Check if we have stored token
      const storedToken = localStorage.getItem('authToken');
      const storedEmail = localStorage.getItem('userEmail');
      
      if (storedToken && storedEmail) {
        showDashboard(storedEmail);
      } else {
        showLogin();
      }
    }
    
    function loginWithGoogle() {
      const deviceSignature = getDeviceSignature();
      const redirectUrl = window.location.origin;
      
      const oauthUrl = `${API_URL}/auth/google?deviceSignature=${encodeURIComponent(deviceSignature)}&redirectUrl=${encodeURIComponent(redirectUrl)}`;
      
      window.location.href = oauthUrl;
    }
    
    function getDeviceSignature() {
      let deviceId = localStorage.getItem('deviceSignature');
      if (!deviceId) {
        deviceId = `device-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('deviceSignature', deviceId);
      }
      return deviceId;
    }
    
    function showLogin() {
      document.getElementById('login-section').classList.remove('hidden');
      document.getElementById('dashboard-section').classList.add('hidden');
    }
    
    function showDashboard(email) {
      document.getElementById('user-email').textContent = email;
      document.getElementById('login-section').classList.add('hidden');
      document.getElementById('dashboard-section').classList.remove('hidden');
    }
    
    function logout() {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userId');
      localStorage.removeItem('userEmail');
      showLogin();
    }
  </script>
</body>
</html>
```

## Troubleshooting

### Common Issues

**Issue**: Redirect URL mismatch
- **Solution**: Ensure the `redirectUrl` parameter matches your frontend's actual URL
- Check that the URL is properly encoded

**Issue**: Token not being received
- **Solution**: Check browser console for errors
- Verify the API is running and accessible
- Check CORS settings on the backend

**Issue**: "Invalid device signature" error
- **Solution**: Ensure device signature is being passed consistently
- Check that the device signature is stored in localStorage

**Issue**: OAuth flow doesn't initiate
- **Solution**: Verify Google OAuth credentials are configured correctly in the backend
- Check that authorized redirect URIs are set up in Google Cloud Console

## Support

For additional help:
- Backend Documentation: See `GOOGLE_AUTH_SETUP.md`
- API Documentation: Check Swagger UI at `/api/docs`
- Issues: Contact your backend team

---

**Last Updated**: February 2026
