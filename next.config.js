/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Build in-process; the separate webpack worker is too memory-hungry
    // for small ARM/Termux machines (and is unnecessary elsewhere).
    webpackBuildWorker: false,
  },
  // Allow server-side fetching of YouTube pages without CORS issues
  async headers() {
    return [];
  },
};

module.exports = nextConfig;
