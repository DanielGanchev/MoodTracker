/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // This tells Next.js to export static files to 'out' directory
  images: {
    unoptimized: true // Required for static export
  }
}

module.exports = nextConfig