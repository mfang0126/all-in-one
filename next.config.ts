/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    // Allow override through environment variable
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      (() => {
        console.log('NODE_ENV:', process.env.NODE_ENV); // Debug environment
        if (process.env.NODE_ENV === 'production') {
          return 'https://api.pteyyds.com';
        }
        return 'https://api-freedom.pteyyds.com';
      })();

    console.log('Using API URL:', apiUrl); // Debug selected API URL
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`
      }
    ];
  }
};

export default nextConfig;
