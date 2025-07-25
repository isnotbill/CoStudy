import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['localhost', 'costudy-images-bucket.s3.ca-central-1.amazonaws.com', 'api.costudy.online', 'developers.google.com'],
  },
};

export default nextConfig;
