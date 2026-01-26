# Video Progress Tracking Implementation

This implementation provides real-time video progress tracking using WebSocket connections and Zustand for state management.

## Components

### 1. Zustand Store (`store/useVideoProgressStore.tsx`)

Manages WebSocket connection state and provides actions for connecting, disconnecting, and updating progress.

### 2. Hooks

- `useVideoProgressTracking`: Low-level hook for manual progress tracking control
- `useVideoPlayerProgress`: Higher-level hook that automatically handles video player events

### 3. Component

- `ProgressTrackingVideoPlayer`: Ready-to-use video player component with progress tracking

## Usage Examples

### Basic Usage with Custom Video Player

```tsx
import { useVideoPlayerProgress } from '@/lib/hooks/useVideoPlayerProgress';

function MyVideoPlayer({ videoId, videoUrl }) {
  const { token } = useAuth();

  const { videoRef, isConnected, error } = useVideoPlayerProgress({
    videoId,
    token: token || '',
    enabled: !!token,
  });

  return (
    <div>
      {isConnected && <div className="text-green-500">✓ Connected</div>}
      {error && <div className="text-red-500">Error: {error}</div>}

      <video ref={videoRef} src={videoUrl} controls className="w-full" />
    </div>
  );
}
```

### Using the Pre-built Component

```tsx
import ProgressTrackingVideoPlayer from '@/components/progress-tracking-video-player';

function VideoPage({ videoId, videoUrl }) {
  return (
    <ProgressTrackingVideoPlayer
      videoId={videoId}
      videoUrl={videoUrl}
      onProgressUpdate={position => {
        console.log('Progress updated:', position);
      }}
      onConnectionChange={connected => {
        console.log('Connection status:', connected);
      }}
    />
  );
}
```

### Manual Progress Tracking

```tsx
import { useVideoProgressTracking } from '@/lib/hooks/useVideoProgressTracking';

function CustomPlayer({ videoId }) {
  const { token } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);

  const { startTracking, stopTracking, manualUpdate } =
    useVideoProgressTracking({
      videoId,
      token: token || '',
    });

  const handlePlay = () => {
    if (videoRef.current) {
      startTracking(videoRef.current);
    }
  };

  const handlePause = () => {
    stopTracking();
  };

  return (
    <video ref={videoRef} onPlay={handlePlay} onPause={handlePause} controls />
  );
}
```

## Configuration

### Environment Variables

Update your WebSocket URL in the store:

```typescript
// In store/useVideoProgressStore.tsx
const wsUrl = isProduction
  ? `wss://your-domain.com?auth=${token}` // Replace with your production URL
  : `ws://localhost:3000?auth=${token}`;
```

### Update Intervals

Customize the progress update frequency:

```tsx
useVideoPlayerProgress({
  videoId,
  token,
  updateInterval: 10000, // Update every 10 seconds
});
```

## Features

- ✅ Automatic WebSocket connection management
- ✅ Real-time progress tracking
- ✅ Connection status indicators
- ✅ Error handling and reconnection
- ✅ Automatic cleanup on component unmount
- ✅ Throttled updates to prevent spam
- ✅ TypeScript support
- ✅ React integration with hooks

## Troubleshooting

### Video Not Playing or Controls Not Working

**Problem**: Video doesn't load or controls are unresponsive.

**Solutions**:

1. **Check Video URL**: Ensure you're providing a direct video file URL (`.mp4`, `.webm`, etc.), not an embed URL.

```tsx
// ✅ Correct - direct video file
<VideoPlayer
  enableProgressTracking={true}
  videoUrl="https://example.com/video.mp4"
  videoId="123"
/>

// ❌ Wrong - embed URL
<VideoPlayer
  enableProgressTracking={true}
  videoUrl="https://iframe.mediadelivery.net/embed/..."
/>
```

2. **CORS Issues**: The video element includes `crossOrigin="anonymous"` for CORS support.

3. **Video Format Support**: Ensure the video format is supported by the browser.

4. **Test Component**: Use `VideoTestComponent` to verify video playback works with known URLs.

### WebSocket Connection Issues

**Problem**: WebSocket not connecting or progress not saving.

**Check**:

- JWT token is available (`useGetToken` returns valid token)
- WebSocket URL is correct (check browser network tab)
- Server is running and accepting connections

### Infinite Loop Errors

**Problem**: "Maximum update depth exceeded" or "getSnapshot should be cached".

**Fixed by**:

- Removing action functions from `useEffect` dependency arrays
- Using stable action references in selectors

## Bunny.net Integration

**✅ Now Supported!** Progress tracking works with Bunny.net iframe players using Player.js API.

### For Bunny.net Videos with Progress Tracking

```tsx
<VideoPlayer
  videoId="your-bunny-video-id"
  enableProgressTracking={true}
  className="self-center"
/>
```

**How it works:**

- Loads Bunny.net's Player.js library automatically
- Uses Player.js API to listen for video events (`timeupdate`, `play`, `pause`, `ended`)
- Sends progress updates to WebSocket every 5 seconds during playback
- Tracks final position on pause/end

### For Custom Video URLs

```tsx
<VideoPlayer
  videoId="123"
  videoUrl="https://example.com/video.mp4"
  enableProgressTracking={true}
/>
```

### For Bunny.net Videos (No Tracking)

```tsx
<VideoPlayer videoId="your-bunny-video-id" className="self-center" />
```

## Server Integration

Make sure your backend WebSocket server is running and configured according to the `WEBSOCKET_CLIENT_GUIDE.md` specifications.

The client expects:

- WebSocket endpoint at `/` (root)
- JWT authentication via `?auth=JWT_TOKEN` query parameter
- Message format: `{ event: 'update_progress', data: { videoId, position } }`
