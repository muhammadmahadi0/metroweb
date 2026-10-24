/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Allow server-side fetching of YouTube pages without CORS issues
  async headers() {
    return [];
  },
};

module.exports = nextConfig;
