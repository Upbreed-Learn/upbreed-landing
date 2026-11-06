import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        port: '',
        pathname: '/**',
      },
      // Course thumbnails, instructor photos and blog images (Bunny CDN).
      { protocol: 'https', hostname: 'cdn.upbreedlearn.com', port: '', pathname: '/**' },
      { protocol: 'https', hostname: '*.b-cdn.net', port: '', pathname: '/**' },
      {
        protocol: 'https',
        hostname: 'upbreed-learn-dev.b-cdn.net',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
