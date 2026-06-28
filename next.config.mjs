import fs from 'fs';
import path from 'path';

const srcImage = "C:\\Users\\Viswaas-E\\.gemini\\antigravity-ide\\brain\\db29ece4-ff48-4593-868e-4496edd5188b\\hero_illustration_1782651590484.png";
const destImage = "c:\\Work\\technician_app\\main_app\\public\\hero-illustration.png";

try {
  if (fs.existsSync(srcImage)) {
    fs.copyFileSync(srcImage, destImage);
    console.log("[Next.js Config] Successfully copied hero-illustration.png to public");
  }
} catch (err) {
  console.error("[Next.js Config] Failed to copy hero image:", err);
}

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
