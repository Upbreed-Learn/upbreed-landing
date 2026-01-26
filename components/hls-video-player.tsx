'use client';

import { useEffect, useRef } from 'react';
import Hls from 'hls.js';

type Props = {
  src: string; // playlist.m3u8 URL
};

export default function HlsVideoPlayer({ src }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = null;

    // Safari (native HLS)
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
    }
    // Other browsers
    else if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      });

      hls.loadSource(src);
      hls.attachMedia(video);
    } else {
      console.error('HLS not supported in this browser');
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      controls
      className="h-full w-full rounded-lg object-cover"
      playsInline
      preload="metadata"
      crossOrigin="anonymous"
      onError={e => {
        console.error('Video loading error:', e);
        console.error('Video src:', src);
      }}
      onLoadStart={() => {
        console.log('Video load started for:', src);
      }}
      onLoadedData={() => {
        console.log('Video data loaded for:', src);
      }}
      onCanPlay={() => {
        console.log('Video can play:', src);
      }}
    >
      Your browser does not support the video tag.
    </video>
  );
}
