import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL('https://elasticbeanstalk-ap-southeast-1-812125550400.s3.ap-southeast-1.amazonaws.com/images/**'),
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;
