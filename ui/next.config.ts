import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.costudy.online',
      },
      {
        protocol: 'https',
        hostname: 'costudy-images-bucket.s3.ca-central-1.amazonaws.com',
      },
    ],
  },
};

export default nextConfig;
