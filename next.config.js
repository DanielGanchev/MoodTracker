/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',  // Comment this out for development
  images: {
    unoptimized: true, // Required for static export
  },
}

module.exports = nextConfig
