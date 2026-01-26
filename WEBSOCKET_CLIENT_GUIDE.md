# WebSocket Video Progress Tracking - Frontend Integration Guide

## Overview
This WebSocket connection allows real-time tracking of video playback progress. The server automatically saves progress, calculates completion status (≥90%), and maintains the maximum position reached for each video.

## Connection Details

### **Endpoint**
```
ws://your-domain.com?auth=JWT_TOKEN
```

**Production:**
```
wss://your-domain.com?auth=JWT_TOKEN
```

### **Authentication**
- Pass your JWT token as a query parameter: `?auth=YOUR_JWT_TOKEN`
- The token is verified on connection
- Invalid/missing tokens will result in connection rejection with error codes:
  - `4001`: Authentication token required
  - `4002`: Invalid authentication token
  - `4003`: Authentication failed

## Client Implementation

### **JavaScript/TypeScript (Vanilla)**

```javascript
// Get JWT token from your auth system
const token = localStorage.getItem('jwt_token'); // or from your auth context

// Connect to WebSocket
const ws = new WebSocket(`ws://localhost:3000?auth=${token}`);

ws.onopen = () => {
  console.log('✅ Connected to video progress tracker');
};

// Send progress updates (recommended: every 5-10 seconds during playback)
function updateProgress(videoId, currentPosition) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({
      event: 'update_progress',
      data: {
        videoId: videoId,        // integer: ID of the video
        position: currentPosition // integer: current playback position in seconds
      }
    }));
  }
}

// Handle server responses
ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  
  if (message.event === 'progress_updated') {
    console.log('✅ Progress saved');
    // Update UI if needed
  } else if (message.event === 'error') {
    console.error('❌ Error:', message.data.message);
  }
};

ws.onerror = (error) => {
  console.error('WebSocket error:', error);
};

ws.onclose = (event) => {
  console.log(`Disconnected: ${event.code} - ${event.reason}`);
  // Implement reconnection logic if needed
};

// Example: Update progress every 5 seconds during video playback
let progressInterval;

function startTracking(videoId, videoPlayer) {
  progressInterval = setInterval(() => {
    const currentTime = Math.floor(videoPlayer.currentTime);
    updateProgress(videoId, currentTime);
  }, 5000); // 5 seconds
}

function stopTracking() {
  clearInterval(progressInterval);
}
```

### **React Hook Example**

```typescript
import { useEffect, useRef, useState } from 'react';

interface UseVideoProgressOptions {
  videoId: number;
  token: string;
  enabled?: boolean;
}

export const useVideoProgress = ({ videoId, token, enabled = true }: UseVideoProgressOptions) => {
  const ws = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || !token) return;

    // Connect to WebSocket
    ws.current = new WebSocket(`ws://localhost:3000?auth=${token}`);

    ws.current.onopen = () => {
      setIsConnected(true);
      setError(null);
      console.log('Connected to video progress tracker');
    };

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.event === 'error') {
        setError(message.data.message);
      }
    };

    ws.current.onerror = () => {
      setError('WebSocket connection failed');
    };

    ws.current.onclose = () => {
      setIsConnected(false);
    };

    return () => {
      ws.current?.close();
    };
  }, [token, enabled]);

  const updateProgress = (position: number) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(
        JSON.stringify({
          event: 'update_progress',
          data: { videoId, position }
        })
      );
    }
  };

  return { isConnected, updateProgress, error };
};

// Usage in component:
function VideoPlayer({ videoId, videoUrl }) {
  const { token } = useAuth(); // Your auth hook
  const videoRef = useRef<HTMLVideoElement>(null);
  const { isConnected, updateProgress } = useVideoProgress({ videoId, token });

  useEffect(() => {
    if (!videoRef.current || !isConnected) return;

    // Send progress every 5 seconds
    const interval = setInterval(() => {
      const position = Math.floor(videoRef.current!.currentTime);
      updateProgress(position);
    }, 5000);

    return () => clearInterval(interval);
  }, [isConnected, updateProgress]);

  return (
    <video ref={videoRef} src={videoUrl} controls />
  );
}
```

### **React with Context API**

```typescript
// VideoProgressContext.tsx
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

interface VideoProgressContextType {
  updateProgress: (videoId: number, position: number) => void;
  isConnected: boolean;
}

const VideoProgressContext = createContext<VideoProgressContextType | null>(null);

export const VideoProgressProvider: React.FC<{ token: string; children: React.ReactNode }> = ({ 
  token, 
  children 
}) => {
  const ws = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!token) return;

    ws.current = new WebSocket(`ws://localhost:3000?auth=${token}`);

    ws.current.onopen = () => {
      setIsConnected(true);
    };

    ws.current.onclose = () => {
      setIsConnected(false);
    };

    return () => {
      ws.current?.close();
    };
  }, [token]);

  const updateProgress = (videoId: number, position: number) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(
        JSON.stringify({
          event: 'update_progress',
          data: { videoId, position }
        })
      );
    }
  };

  return (
    <VideoProgressContext.Provider value={{ updateProgress, isConnected }}>
      {children}
    </VideoProgressContext.Provider>
  );
};

export const useVideoProgressContext = () => {
  const context = useContext(VideoProgressContext);
  if (!context) {
    throw new Error('useVideoProgressContext must be used within VideoProgressProvider');
  }
  return context;
};
```

### **Vue 3 Composition API**

```typescript
// useVideoProgress.ts
import { ref, onMounted, onUnmounted } from 'vue';

export function useVideoProgress(videoId: number, token: string) {
  const ws = ref<WebSocket | null>(null);
  const isConnected = ref(false);
  const error = ref<string | null>(null);

  const connect = () => {
    ws.value = new WebSocket(`ws://localhost:3000?auth=${token}`);

    ws.value.onopen = () => {
      isConnected.value = true;
      error.value = null;
    };

    ws.value.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.event === 'error') {
        error.value = message.data.message;
      }
    };

    ws.value.onclose = () => {
      isConnected.value = false;
    };
  };

  const updateProgress = (position: number) => {
    if (ws.value?.readyState === WebSocket.OPEN) {
      ws.value.send(
        JSON.stringify({
          event: 'update_progress',
          data: { videoId, position }
        })
      );
    }
  };

  onMounted(() => {
    connect();
  });

  onUnmounted(() => {
    ws.value?.close();
  });

  return {
    isConnected,
    updateProgress,
    error
  };
}
```

## Message Format

### **Sending Progress Update**

```json
{
  "event": "update_progress",
  "data": {
    "videoId": 123,
    "position": 450
  }
}
```

**Fields:**
- `videoId` (integer, required): ID of the video being watched
- `position` (integer, required, ≥ 0): Current playback position in seconds

### **Success Response**

```json
{
  "event": "progress_updated"
}
```

### **Error Response**

```json
{
  "event": "error",
  "data": {
    "message": "Error description"
  }
}
```

**Common Errors:**
- `"Unauthorized"` - User not authenticated
- `"Validation failed"` - Invalid videoId or position
- `"Video with ID X not found"` - Invalid video ID

## REST API Endpoints (Alternative)

If you need to query progress without WebSocket:

### **Get Progress for Specific Video**
```
GET /course/video/:videoId/progress
Authorization: Bearer JWT_TOKEN
```

**Response:**
```json
{
  "id": 1,
  "userId": 10,
  "videoId": 123,
  "lastPosition": 450,
  "maxPosition": 600,
  "videoDurationSeconds": 1200,
  "isFinished": false,
  "createdAt": "2026-01-20T10:00:00Z",
  "updatedAt": "2026-01-20T10:05:00Z"
}
```

### **Get All Progress for a Course**
```
GET /course/:courseId/progress
Authorization: Bearer JWT_TOKEN
```

**Response:**
```json
[
  {
    "id": 1,
    "videoId": 123,
    "lastPosition": 450,
    "maxPosition": 600,
    "isFinished": false,
    // ... other fields
  },
  // ... more videos
]
```

## Best Practices

### **1. Update Frequency**
- Send updates every 5-10 seconds during playback
- Don't send updates when video is paused
- Send a final update when user navigates away

### **2. Connection Management**
```javascript
// Implement reconnection logic
function connectWithRetry(token, maxRetries = 3) {
  let retries = 0;
  
  function connect() {
    const ws = new WebSocket(`ws://localhost:3000?auth=${token}`);
    
    ws.onclose = (event) => {
      if (event.code !== 1000 && retries < maxRetries) {
        retries++;
        setTimeout(() => connect(), 2000 * retries);
      }
    };
    
    return ws;
  }
  
  return connect();
}
```

### **3. Error Handling**
```javascript
ws.onerror = (error) => {
  console.error('WebSocket error:', error);
  // Show user-friendly message
  showNotification('Connection lost. Progress will sync when reconnected.');
};
```

### **4. Cleanup**
Always close WebSocket connections when component unmounts or user logs out:
```javascript
useEffect(() => {
  return () => {
    ws.current?.close();
  };
}, []);
```

### **5. Video Player Integration**
Send progress on multiple events:
```javascript
videoPlayer.on('timeupdate', () => {
  // Throttle to every 5 seconds
  throttledUpdateProgress(videoId, videoPlayer.currentTime);
});

videoPlayer.on('pause', () => {
  // Send current position when paused
  updateProgress(videoId, videoPlayer.currentTime);
});

videoPlayer.on('ended', () => {
  // Send final position
  updateProgress(videoId, videoPlayer.duration);
});
```

## Server-Side Progress Calculation

The server automatically:
- ✅ Updates `lastPosition` to current playback position
- ✅ Updates `maxPosition` if current position exceeds it
- ✅ Sets `isFinished = true` when user reaches ≥90% of video duration
- ✅ Stores `videoDurationSeconds` (denormalized from video table)

## Testing

Use browser console to test:
```javascript
const ws = new WebSocket('ws://localhost:3000?auth=YOUR_TOKEN');
ws.onopen = () => console.log('Connected');
ws.onmessage = (e) => console.log('Received:', e.data);
ws.send(JSON.stringify({
  event: 'update_progress',
  data: { videoId: 1, position: 100 }
}));
```

## Environment Configuration

Update your WebSocket URL based on environment:
```typescript
const WS_URL = process.env.NODE_ENV === 'production' 
  ? 'wss://api.yourdomain.com'
  : 'ws://localhost:3000';
```

## Support

For issues or questions, contact the backend team or check the API documentation.
