/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.watchOptions = {
      poll: true,
    };
    return config;
  },
};

export default nextConfig;
