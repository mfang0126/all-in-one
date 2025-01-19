import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    const apiUrl =
      process.env.API_URL || (process.env.NODE_ENV === 'production' ? 'https://api-dev.pteyyds.com' : 'https://api-freedom.pteyyds.com');

    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`
      }
    ];
  }
};

export default nextConfig;
