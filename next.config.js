/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
    };
    return config;
  },
  // Enable static export for Vercel
  output: "export",
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
