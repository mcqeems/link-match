import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      new URL('https://elasticbeanstalk-ap-southeast-1-812125550400.s3.ap-southeast-1.amazonaws.com/images/**'),
    ],
  },
};

export default nextConfig;
