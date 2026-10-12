/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: [
    '*.devtunnels.ms',
    '*.inc1.devtunnels.ms',
    '*.asse.devtunnels.ms',
    '*.use.devtunnels.ms',
    '*.euw.devtunnels.ms',
  ],
  images: {
    qualities: [75, 95, 100],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
};

export default nextConfig;
