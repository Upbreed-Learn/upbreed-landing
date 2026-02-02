/**
 * VideoPlayer Component - Supports multiple video playback modes:
 *
 * Priority Order (highest to lowest):
 *
 * 1. Bunny Iframe with Progress Tracking:
 *    - enableProgressTracking + string videoId
 *    - Uses Player.js to track progress from iframe (preferred for Bunny videos)
 *
 * 2. Bunny HLS Video with Progress Tracking:
 *    - bunnyPullZone + bunnyToken + enableProgressTracking + string videoId
 *    - Uses HLS streams in HTML5 video for tracking
 *
 * 3. HTML5 Video with Progress Tracking:
 *    - videoUrl + enableProgressTracking + numeric/string videoId
 *    - Full progress tracking via WebSocket (supports both string and number videoIds)
 *
 * 4. Bunny HLS Video without Tracking:
 *    - bunnyPullZone + bunnyToken + enableProgressTracking=false
 *    - Uses HLS streams but no WebSocket tracking
 *
 * 5. HTML5 Video without Tracking:
 *    - videoUrl only
 *    - Basic video playback without progress tracking
 *
 * 6. Bunny Iframe (No Tracking):
 *    - Default fallback, no progress tracking possible
 *
 * Note: Progress tracking works with both numeric and string videoIds.
 * Supports both string (Bunny UUIDs) and number videoIds for WebSocket progress tracking.
 */

import { useVideoPlayerProgress } from '@/lib/hooks/useVideoPlayerProgress';
import { useGetToken } from '@/lib/queries/hooks';
import { cn } from '@/lib/utils';
import { useEffect, useRef } from 'react';
import BunnyPlayerWithTracking from './bunny-player-with-tracking';

const libraryId = process.env.NEXT_PUBLIC_LIBRARY_ID;

interface VideoPlayerProps {
  videoId?: string | number;
  className?: string;
  enableProgressTracking?: boolean; // New prop to enable progress tracking
  videoUrl?: string; // Allow custom video URL for HTML5 videos
  bunnyPullZone?: string; // Bunny CDN pull zone for HLS streams
  bunnyToken?: string; // Bunny token for signed URLs
}

const VideoPlayer = ({
  videoId,
  className,
  enableProgressTracking = false,
  videoUrl,
  bunnyPullZone,
  bunnyToken,
}: VideoPlayerProps) => {
  const { data: tokenData } = useGetToken();
  const token = tokenData?.data.token;

  console.log('VideoPlayer render:', {
    videoId,
    videoIdType: typeof videoId,
    enableProgressTracking,
    hasVideoUrl: !!videoUrl,
    hasBunnyPullZone: !!bunnyPullZone,
    hasToken: !!token,
  });

  // Construct HLS URL for Bunny videos when progress tracking is enabled
  const bunnyHlsUrl =
    bunnyPullZone && typeof videoId === 'string' && bunnyToken
      ? `https://${bunnyPullZone}.b-cdn.net/${videoId}/playlist.m3u8?token=${bunnyToken}&expires=1893456000`
      : null;

  // Determine if we should use HTML5 video with HLS for progress tracking
  const shouldUseHlsForTracking = enableProgressTracking && bunnyHlsUrl;

  // Only use progress tracking for HTML5 videos (not iframes) and when we have a valid videoId
  const { videoRef, isConnected, error, clearError } = useVideoPlayerProgress({
    videoId: videoId || '',
    token: token || '',
    enabled: !!(
      shouldUseHlsForTracking ||
      (enableProgressTracking && !!token && !!videoUrl && !!videoId)
    ),
    onProgressUpdate: position => {
      console.log('Progress updated:', position);
    },
    onConnectionChange: connected => {
      console.log('Connection status:', connected);
    },
  });

  // Warn if progress tracking is requested but videoId is not valid
  if (enableProgressTracking && !videoId) {
    console.warn(
      'Progress tracking requested but videoId is missing. Progress tracking will not work.',
    );
  }

  // If progress tracking is enabled for Bunny iframes with string videoId, use Player.js
  // This takes priority over HLS when we have a string videoId
  if (enableProgressTracking && typeof videoId === 'string' && !videoUrl) {
    console.log('Using Bunny iframe with Player.js progress tracking');
    return (
      <BunnyPlayerWithTracking
        videoId={videoId}
        className={className}
        token={token}
      />
    );
  }

  // If progress tracking is enabled for Bunny videos with HLS streams, use HTML5 video
  if (shouldUseHlsForTracking) {
    console.log('Using HLS video with progress tracking for Bunny video');
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

        {/* HLS Video Element */}
        <video
          ref={videoRef}
          src={bunnyHlsUrl!}
          controls
          className="h-full w-full rounded-lg object-cover"
          playsInline
          preload="metadata"
          crossOrigin="anonymous"
          onError={e => {
            console.error('HLS Video loading error:', e);
            console.error('HLS src:', bunnyHlsUrl);
          }}
          onLoadStart={() => {
            console.log('HLS Video load started for:', bunnyHlsUrl);
          }}
          onLoadedData={() => {
            console.log('HLS Video data loaded for:', bunnyHlsUrl);
          }}
          onCanPlay={() => {
            console.log('HLS Video can play:', bunnyHlsUrl);
          }}
        >
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  // If progress tracking is enabled for Bunny iframes with string videoId, use Player.js
  if (
    enableProgressTracking &&
    !videoUrl &&
    typeof videoId === 'string' &&
    !bunnyHlsUrl
  ) {
    console.log(
      'Using Bunny iframe with Player.js progress tracking (fallback)',
    );
    return (
      <BunnyPlayerWithTracking
        videoId={videoId}
        className={className}
        token={token}
      />
    );
  }

  // If progress tracking is enabled with custom video URL and numeric videoId, use HTML5 video element
  if (enableProgressTracking && videoUrl && typeof videoId === 'number') {
    console.log('Using HTML5 video with progress tracking');
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

  // If no progress tracking or invalid config, use HTML5 video without tracking
  if (videoUrl) {
    console.log('Using HTML5 video without progress tracking');
    return (
      <div className={cn('relative aspect-video w-full', className)}>
        <video
          src={videoUrl}
          controls
          className="h-full w-full rounded-lg object-cover"
          playsInline
          preload="metadata"
          crossOrigin="anonymous"
        >
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  // Default: use iframe (Bunny.net) - no progress tracking possible
  console.log('Using plain Bunny iframe - NO progress tracking');
  const bunnyVideoId =
    typeof videoId === 'string'
      ? videoId
      : 'b42c8ac6-8576-49b6-a2f3-b0f13dcb3f95';
  return (
    <div
      className={cn(
        'okay relative aspect-video w-full overflow-hidden rounded-xl',
        className,
      )}
    >
      <iframe
        src={`https://iframe.mediadelivery.net/embed/${libraryId}/${bunnyVideoId}`}
        loading="lazy"
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 h-full w-full border-0"
      />
    </div>
  );
};

export default VideoPlayer;
