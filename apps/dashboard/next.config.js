import { config } from 'dotenv';
import path from 'path';

// Load environment variables from workspace root
config({ path: path.resolve(process.cwd(), '../../.env') });
config({ path: path.resolve(process.cwd(), '../../.env.local'), override: true });

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@dassh/ui", "@dassh/shared", "@dassh/widgets"],

  eslint: {
    ignoreDuringBuilds: false,
  },

  typescript: {
    ignoreBuildErrors: false,
  },

  images: {
    formats: ['image/webp', 'image/avif'],
  },
  devIndicators: {
    position: 'bottom-right'
  },
  // Performance optimizations
  poweredByHeader: false,

  compress: true,

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
        ],
      },
    ];
  },

  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    }
  }
};

export default nextConfig;