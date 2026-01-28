import { useVideoPlayerProgress } from '@/lib/hooks/useVideoPlayerProgress';
import { useGetToken } from '@/lib/queries/hooks';
import { cn } from '@/lib/utils';
import { useEffect, useRef } from 'react';
import BunnyPlayerWithTracking from './bunny-player-with-tracking';

const libraryId = process.env.NEXT_PUBLIC_LIBRARY_ID;

interface VideoPlayerProps {
  videoId?: string;
  className?: string;
  enableProgressTracking?: boolean; // New prop to enable progress tracking
  videoUrl?: string; // Allow custom video URL for HTML5 videos
}

const VideoPlayer = ({
  videoId = 'b42c8ac6-8576-49b6-a2f3-b0f13dcb3f95',
  className,
  enableProgressTracking = false,
  videoUrl,
}: VideoPlayerProps) => {
  const { data: tokenData } = useGetToken();
  const token = tokenData?.data.token;

  // Only use progress tracking for HTML5 videos (not iframes)
  const { videoRef, isConnected, error, clearError } = useVideoPlayerProgress({
    videoId,
    token: token || '',
    enabled: enableProgressTracking && !!token && !!videoUrl, // Only enable for HTML5 videos
    onProgressUpdate: position => {
      console.log('Progress updated:', position);
    },
    onConnectionChange: connected => {
      console.log('Connection status:', connected);
    },
  });

  // If progress tracking is enabled for Bunny iframes, use Player.js
  if (enableProgressTracking && !videoUrl) {
    return (
      <BunnyPlayerWithTracking
        videoId={videoId}
        className={className}
        token={token}
      />
    );
  }

  // If progress tracking is enabled with custom video URL, use HTML5 video element
  if (!enableProgressTracking && videoUrl) {
    return (
      <div className={cn('relative aspect-video w-full', className)}>
        {/* Connection Status Indicator */}
        {isConnected && (
          <div className="absolute top-2 right-2 z-10 flex items-center gap-1 rounded bg-green-500/90 px-2 py-1 text-xs text-white">
            <div className="h-2 w-2 animate-pulse rounded-full bg-white" />
            Connected
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="absolute top-2 left-2 z-10 max-w-xs">
            <div className="rounded bg-red-500/90 px-3 py-2 text-sm text-white">
              <p className="font-medium">Connection Error</p>
              <p className="text-xs opacity-90">{error}</p>
              <button
                onClick={clearError}
                className="mt-1 text-xs underline hover:no-underline"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* HTML5 Video Element */}
        <video
          ref={videoRef}
          src={videoUrl}
          controls
          className="h-full w-full rounded-lg object-cover"
          playsInline
          preload="metadata"
          crossOrigin="anonymous"
          onError={e => {
            console.error('Video loading error:', e);
            console.error('Video src:', videoUrl);
          }}
          onLoadStart={() => {
            console.log('Video load started for:', videoUrl);
          }}
          onLoadedData={() => {
            console.log('Video data loaded for:', videoUrl);
          }}
          onCanPlay={() => {
            console.log('Video can play:', videoUrl);
          }}
        >
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  // Default: use iframe (Bunny.net) - no progress tracking possible
  return (
    <div
      className={cn(
        'relative aspect-video w-full overflow-hidden rounded-xl',
        className,
      )}
    >
      <iframe
        src={`https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}`}
        loading="lazy"
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 h-full w-full border-0"
      />
    </div>
  );
};

export default VideoPlayer;
