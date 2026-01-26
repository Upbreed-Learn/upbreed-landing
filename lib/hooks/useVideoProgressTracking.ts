import { useEffect, useRef, useCallback } from 'react';
import {
  useVideoProgressStore,
  useVideoProgressActions,
} from '@/store/useVideoProgressStore';

interface UseVideoProgressTrackingOptions {
  videoId: string;
  token: string;
  enabled?: boolean;
  updateInterval?: number; // in milliseconds, default 5000 (5 seconds)
}

export const useVideoProgressTracking = ({
  videoId,
  token,
  enabled = true,
  updateInterval = 5000,
}: UseVideoProgressTrackingOptions) => {
  const { isConnected, error } = useVideoProgressStore();
  const { connect, disconnect, updateProgress, clearError } =
    useVideoProgressActions();

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const lastPositionRef = useRef<number>(0);

  // Connect to WebSocket when token is available and enabled
  useEffect(() => {
    if (enabled && token) {
      connect(token);
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [token, enabled]); // Removed connect and disconnect from dependencies

  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef<number>(0);
  const maxReconnectAttempts = 3;

  // Handle reconnection logic - simplified to avoid infinite loops
  useEffect(() => {
    // Only attempt reconnection if we're not connected and have a token
    if (
      !isConnected &&
      token &&
      reconnectAttemptsRef.current < maxReconnectAttempts
    ) {
      // Clear any existing reconnection timeout
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }

      // Attempt reconnection with exponential backoff
      const delay = Math.min(
        1000 * Math.pow(2, reconnectAttemptsRef.current),
        30000,
      ); // Max 30 seconds

      reconnectTimeoutRef.current = setTimeout(() => {
        console.log(
          `Attempting to reconnect... (attempt ${reconnectAttemptsRef.current + 1})`,
        );
        reconnectAttemptsRef.current += 1;
        connect(token);
      }, delay);
    }

    // Reset reconnection attempts when successfully connected
    if (isConnected) {
      reconnectAttemptsRef.current = 0;
    }

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [isConnected, token]); // Removed connect from dependencies

  // Reset reconnection attempts when token changes
  useEffect(() => {
    reconnectAttemptsRef.current = 0;
  }, [token]);

  // Start tracking progress
  const startTracking = useCallback(
    (videoElement: HTMLVideoElement) => {
      videoRef.current = videoElement;
      lastPositionRef.current = 0;

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      intervalRef.current = setInterval(() => {
        if (videoRef.current && isConnected) {
          const currentTime = videoRef.current.currentTime;

          // Only send update if position has changed significantly (more than 5 seconds)
          // or if it's the first update
          if (
            Math.abs(currentTime - lastPositionRef.current) >= 5 ||
            lastPositionRef.current === 0
          ) {
            updateProgress(videoId, currentTime);
            lastPositionRef.current = currentTime;
          }
        }
      }, updateInterval);
    },
    [videoId, isConnected, updateProgress, updateInterval],
  );

  // Stop tracking progress
  const stopTracking = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Send final progress update when stopping
    if (videoRef.current && isConnected) {
      updateProgress(videoId, videoRef.current.currentTime);
    }

    videoRef.current = null;
    lastPositionRef.current = 0;
  }, [videoId, isConnected, updateProgress]);

  // Manual progress update
  const manualUpdate = useCallback(
    (position: number) => {
      if (isConnected) {
        updateProgress(videoId, position);
        lastPositionRef.current = position;
      }
    },
    [videoId, isConnected, updateProgress],
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    isConnected,
    error,
    startTracking,
    stopTracking,
    manualUpdate,
    clearError,
  };
};
