// next.config.ts (since you have .ts extension)
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:5000/api/:path*',
      },
    ]
  },
}

module.exports = {
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig