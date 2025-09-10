// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  // Suppress hydration warnings in development
  reactStrictMode: true,
  experimental: {
    suppressHydrationWarning: true,
  },
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      }
    }
    return config
  },
}

module.exports = nextConfig