/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async rewrites() {
    const backendUrl = process.env.BACKEND_API_URL || 'https://technician-app.onrender.com';
    return [
      {
        source: '/api/v2/:path*',
        destination: `${backendUrl}/api/v2/:path*`,
      },
      {
        source: '/api/payments/:path*',
        destination: `${backendUrl}/api/payments/:path*`,
      },
      {
        source: '/api/bookings/:path*',
        destination: `${backendUrl}/api/bookings/:path*`,
      },
      {
        source: '/leads/:path*',
        destination: `${backendUrl}/leads/:path*`,
      },
    ];
  },
}

export default nextConfig
