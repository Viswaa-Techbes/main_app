import fs from 'fs';
import path from 'path';
import dns from 'dns';
import http from 'http';
import https from 'https';

// Helps some Windows / Node 17+ setups where IPv6-first DNS causes odd connection behaviour.
if (typeof dns.setDefaultResultOrder === 'function') {
  dns.setDefaultResultOrder('ipv4first');
}


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

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

async function runSeederFromConfig() {
  try {
    const beEnvPath = path.resolve('../BE/.env');
    if (!fs.existsSync(beEnvPath)) {
      console.log("[Seeder] BE/.env not found at", beEnvPath);
      return;
    }
    const beEnv = fs.readFileSync(beEnvPath, 'utf8');
    const match = beEnv.match(/MONGODB_URI\s*=\s*(.*)/);
    if (!match) {
      console.log("[Seeder] MONGODB_URI not found in BE/.env");
      return;
    }
    const mongoUri = match[1].trim().replace(/['"]/g, '');
    console.log("[Seeder] Found MONGODB_URI, connecting...");

    const mongoose = require('../BE/node_modules/mongoose');
    await mongoose.connect(mongoUri);
    console.log("[Seeder] Connected to MongoDB Atlas successfully");

    const Category = require('../BE/models/Category');
    const count = await Category.countDocuments();
    if (count > 0) {
      console.log("[Seeder] Catalog database is already seeded. Count:", count);
      await mongoose.disconnect();
      return;
    }

    console.log("[Seeder] Catalog is empty. Auto-seeding...");
    const { runSeed } = require('../BE/utils/catalogSeeder');
    await runSeed();
    console.log("[Seeder] Auto-seeding completed successfully.");
    await mongoose.disconnect();
  } catch (err) {
    console.error("[Seeder] Failed to run seeder inside next.config.mjs:", err.message);
  }
}

runSeederFromConfig();

async function wakeUpBackend() {
  const backendUrl = process.env.BACKEND_API_URL || 'https://api.techbes.co.in';
  if (backendUrl && !backendUrl.includes('localhost') && !backendUrl.includes('127.0.0.1')) {
    console.log(`[Next.js Config] Triggering backend wake-up ping to ${backendUrl}...`);
    const client = backendUrl.startsWith('https') ? https : http;
    try {
      const req = client.get(`${backendUrl.replace(/\/$/, '')}/health`, (res) => {
        console.log(`[Next.js Config] Backend wake-up ping response status: ${res.statusCode}`);
      });
      req.on('error', (err) => {
        console.warn(`[Next.js Config] Backend wake-up ping status/error (expected if spinning up):`, err.message);
      });
    } catch (err) {
      console.warn(`[Next.js Config] Failed to trigger backend wake-up:`, err.message);
    }
  }
}

wakeUpBackend();



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
    const backendUrl = process.env.BACKEND_API_URL || 'https://api.techbes.co.in';
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
