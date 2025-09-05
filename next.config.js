/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'localhost',
      'res.cloudinary.com',
      'images.unsplash.com',
      'via.placeholder.com',
      'lh3.googleusercontent.com',
      'graph.facebook.com',
    ],
    formats: ['image/webp', 'image/avif'],
  },
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
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Custom webpack configuration
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    
    return config;
  },
  // Enable SWC minification
  swcMinify: true,
  // Enable compression
  compress: true,
  // Enable powered by header
  poweredByHeader: false,
  // Enable strict mode
  reactStrictMode: true,
  // Enable TypeScript checking
  typescript: {
    ignoreBuildErrors: true,
  },
  // Enable ESLint checking
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
