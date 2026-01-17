import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // This allows production builds to complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // This allows production builds to complete even if
    // your project has TypeScript errors.
    ignoreBuildErrors: true,
  },
  /* You can add other config options here */
};

export default nextConfig;