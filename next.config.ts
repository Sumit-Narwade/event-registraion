import type { NextConfig } from "next";
import path from "node:path";

// Loader path from event-visual-edits - use direct resolve to get the actual file
const loaderPath = require.resolve('event-visual-edits/loader.js');

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  outputFileTracingRoot: path.resolve(__dirname, '../../'),
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  allowedDevOrigins: ['*.event.page'],
} as NextConfig;

export default nextConfig;
// Event restart: 1766134960564
