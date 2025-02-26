/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',  // Comment this out for development
  images: {
    unoptimized: true, // Required for static export
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    // Empty out the alias configuration to avoid issues with jspdf-autotable
    // Let Next.js handle the imports natively
    return config
  },
}

module.exports = nextConfig
