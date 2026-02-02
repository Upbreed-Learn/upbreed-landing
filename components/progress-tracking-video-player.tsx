'use client';

import { useVideoPlayerProgress } from '@/lib/hooks/useVideoPlayerProgress';
import { useGetToken } from '@/lib/queries/hooks';
import { cn } from '@/lib/utils';

interface ProgressTrackingVideoPlayerProps {
  videoId: string | number;
  videoUrl: string;
  className?: string;
  onProgressUpdate?: (position: number) => void;
  onConnectionChange?: (connected: boolean) => void;
  poster?: string;
  controls?: boolean;
  autoPlay?: boolean;
  muted?: boolean;
}

export const ProgressTrackingVideoPlayer = ({
  videoId,
  videoUrl,
  className,
  onProgressUpdate,
  onConnectionChange,
  poster,
  controls = true,
  autoPlay = false,
  muted = false,
}: ProgressTrackingVideoPlayerProps) => {
  // Get auth token - you'll need to implement this based on your auth system
  const { data: tokenData } = useGetToken();
  const token = tokenData?.data.token;

  const { videoRef, isConnected, error, clearError } = useVideoPlayerProgress({
    videoId,
    token: token || '',
    enabled: !!token,
    onProgressUpdate,
    onConnectionChange,
  });

  return (
    <div className={cn('relative', className)}>
      {/* Connection Status Indicator */}
      <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
        {isConnected && (
          <div className="flex items-center gap-1 rounded bg-green-500/90 px-2 py-1 text-xs text-white">
            <div className="h-2 w-2 animate-pulse rounded-full bg-white" />
            Connected
          </div>
        )}
        {!isConnected && token && (
          <div className="flex items-center gap-1 rounded bg-yellow-500/90 px-2 py-1 text-xs text-white">
            <div className="h-2 w-2 rounded-full bg-white" />
            Connecting...
          </div>
        )}
      </div>

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

      {/* Video Element */}
      <video
        ref={videoRef}
        src={videoUrl}
        poster={poster}
        controls={controls}
        autoPlay={autoPlay}
        muted={muted}
        className="h-full w-full rounded-lg"
        playsInline
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default ProgressTrackingVideoPlayer;
