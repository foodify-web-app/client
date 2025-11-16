/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['placeholder.svg', 'hebbkx1anhila5yf.public.blob.vercel-storage.com'],
    unoptimized: true,
  },
  experimental: {
    reactCompiler: false,
  },
};

export default nextConfig;
