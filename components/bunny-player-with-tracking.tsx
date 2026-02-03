'use client';

import { useVideoProgressStore } from '@/store/useVideoProgressStore';
import { cn } from '@/lib/utils';
import { useEffect, useRef, useCallback } from 'react';

declare global {
  interface Window {
    playerjs: any;
  }
}

interface BunnyPlayerWithTrackingProps {
  videoId: number;
  className?: string;
  token?: string;
  bunnyVideoId?: string;
}

export const BunnyPlayerWithTracking = ({
  videoId,
  className,
  token,
  bunnyVideoId,
}: BunnyPlayerWithTrackingProps) => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const playerRef = useRef<any>(null);

  // Connect to WebSocket when component mounts
  useEffect(() => {
    if (token) {
      useVideoProgressStore.getState().connect(token);
    }

    return () => {
      useVideoProgressStore.getState().disconnect();
    };
  }, [token]);

  // Load Player.js and set up event listeners for progress tracking
  useEffect(() => {
    let isMounted = true;

    const loadPlayer = async () => {
      // Load Player.js script if not already loaded
      if (!window.playerjs) {
        await new Promise<void>(resolve => {
          const script = document.createElement('script');
          script.src =
            'https://assets.mediadelivery.net/playerjs/playerjs-latest.min.js';
          script.onload = () => resolve();
          script.onerror = () => {
            console.error('Failed to load Player.js');
            resolve(); // Continue anyway
          };
          document.body.appendChild(script);
        });
      }

      if (!iframeRef.current || !isMounted || !window.playerjs) return;

      try {
        const player = new window.playerjs.Player(iframeRef.current);
        playerRef.current = player;

        player.on('ready', () => {});

        // Track progress updates using Player.js timeupdate event
        player.on('timeupdate', (data: any) => {
          if (data && typeof data.seconds === 'number') {
            // Send progress update to WebSocket using string videoId
            useVideoProgressStore
              .getState()
              .updateProgress(videoId, Math.floor(data.seconds));
          }
        });

        // Handle play/pause events for additional tracking
        player.on('play', () => {});

        player.on('pause', () => {
          // Send current position when paused
          if (playerRef.current) {
            playerRef.current.getCurrentTime((seconds: number) => {
              useVideoProgressStore
                .getState()
                .updateProgress(videoId, Math.floor(seconds));
            });
          }
        });

        player.on('ended', () => {
          // Send final position
          if (playerRef.current) {
            playerRef.current.getDuration((duration: number) => {
              useVideoProgressStore
                .getState()
                .updateProgress(videoId, Math.floor(duration));
            });
          }
        });
      } catch (error) {
        console.error('Failed to initialize Bunny player:', error);
      }
    };

    loadPlayer();

    return () => {
      isMounted = false;
      if (playerRef.current) {
        playerRef.current = null;
      }
    };
  }, [videoId]);

  return (
    <div
      className={cn(
        'relative aspect-video w-full overflow-hidden rounded-xl',
        className,
      )}
    >
      <iframe
        ref={iframeRef}
        src={`https://iframe.mediadelivery.net/embed/${process.env.NEXT_PUBLIC_LIBRARY_ID}/${bunnyVideoId}`}
        loading="lazy"
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 h-full w-full border-0"
      />
    </div>
  );
};

export default BunnyPlayerWithTracking;
