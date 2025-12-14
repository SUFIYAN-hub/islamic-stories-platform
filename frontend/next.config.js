/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'islamic-stories-platform.onrender.com',
        pathname: '/**',
      },
    ],
    unoptimized: false, // Keep optimization on
  },
};

module.exports = nextConfig;