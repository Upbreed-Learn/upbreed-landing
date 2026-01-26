// Test component for debugging video issues
// You can temporarily use this to test video playback

import { useVideoPlayerProgress } from '@/lib/hooks/useVideoPlayerProgress';
import { useGetToken } from '@/lib/queries/hooks';

export const VideoTestComponent = () => {
  const { data: tokenData } = useGetToken();
  const token = tokenData?.data.token;

  const { videoRef, isConnected, error, clearError } = useVideoPlayerProgress({
    videoId: 'test-123',
    token: token || '',
    enabled: !!token,
    onProgressUpdate: position => {
      console.log('Progress updated:', position);
    },
    onConnectionChange: connected => {
      console.log('Connection status:', connected);
    },
  });

  // Test with a known working video URL
  const testVideoUrl =
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

  return (
    <div className="rounded-lg border p-4">
      <h3 className="mb-4 text-lg font-bold">Video Test Component</h3>

      {/* Status */}
      <div className="mb-4">
        <p>WebSocket: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}</p>
        {error && (
          <p className="text-red-500">
            Error: {error} <button onClick={clearError}>×</button>
          </p>
        )}
      </div>

      {/* Video Element */}
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
        <video
          ref={videoRef}
          src={testVideoUrl}
          controls
          className="h-full w-full"
          playsInline
          preload="metadata"
          onError={e => {
            console.error('Video error:', e);
          }}
          onLoadStart={() => console.log('Load start')}
          onLoadedData={() => console.log('Data loaded')}
          onCanPlay={() => console.log('Can play')}
          onPlay={() => console.log('Playing')}
          onPause={() => console.log('Paused')}
        >
          Your browser does not support the video tag.
        </video>
      </div>

      <p className="mt-2 text-sm text-gray-600">Test URL: {testVideoUrl}</p>
    </div>
  );
};
