import { useEffect, useRef, useCallback } from 'react';
import { useVideoProgressTracking } from './useVideoProgressTracking';

interface UseVideoPlayerProgressOptions {
  videoId: number;
  token: string;
  enabled?: boolean;
  updateInterval?: number;
  onProgressUpdate?: (position: number) => void;
  onConnectionChange?: (connected: boolean) => void;
}

export const useVideoPlayerProgress = ({
  videoId,
  token,
  enabled = true,
  updateInterval = 5000,
  onProgressUpdate,
  onConnectionChange,
}: UseVideoPlayerProgressOptions) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const {
    isConnected,
    error,
    startTracking,
    stopTracking,
    manualUpdate,
    clearError,
  } = useVideoProgressTracking({
    videoId,
    token,
    enabled,
    updateInterval,
  });

  // Notify about connection changes
  useEffect(() => {
    onConnectionChange?.(isConnected);
  }, [isConnected, onConnectionChange]);

  // Set up video event listeners
  const setupVideoListeners = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => {
      startTracking(video);
    };

    const handlePause = () => {
      // Send current position when paused
      if (video) {
        manualUpdate(video.currentTime);
        onProgressUpdate?.(video.currentTime);
      }
    };

    const handleEnded = () => {
      // Send final position when video ends
      if (video) {
        manualUpdate(video.duration);
        onProgressUpdate?.(video.duration);
      }
      stopTracking();
    };

    const handleTimeUpdate = () => {
      // Optional: handle time updates for UI feedback
      if (video) {
        onProgressUpdate?.(video.currentTime);
      }
    };

    // Add event listeners
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('timeupdate', handleTimeUpdate);

    // Cleanup function
    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [startTracking, stopTracking, manualUpdate, onProgressUpdate]);

  // Set up listeners when video element is available
  useEffect(() => {
    const cleanup = setupVideoListeners();
    return cleanup;
  }, [setupVideoListeners]);

  // Cleanup tracking when component unmounts or video changes
  useEffect(() => {
    return () => {
      stopTracking();
    };
  }, [stopTracking]);

  return {
    videoRef,
    isConnected,
    error,
    clearError,
    // Additional methods for manual control
    startTracking: () => videoRef.current && startTracking(videoRef.current),
    stopTracking,
    manualUpdate,
  };
};
