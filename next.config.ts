import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

// Ensure Turbopack treats the folder containing this config as the project root.
// This fixes cases where Next.js incorrectly infers the root as `/app` and then
// fails to resolve `next/package.json`.
const configDir = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: configDir,
  },
  // Production optimizations
  poweredByHeader: false,
  compress: true,
  // Image optimization
  // All images have been pre-converted to WebP format for optimal performance
  // This provides 60-70% file size reduction while maintaining quality
  images: {
    formats: ['image/webp'], // Prefer WebP format
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60, // Cache images for 60 seconds in development
    unoptimized: true, // Images are pre-converted, no runtime optimization needed
  },
  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
        ],
      },
    ];
  },
};

export default nextConfig;
