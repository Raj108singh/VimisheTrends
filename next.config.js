/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons']
  },
  
  // Configure images for e-commerce optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'vimishefashiontrends.com',
      },
    ],
  },

  // Transpile necessary packages
  transpilePackages: ['@radix-ui/react-icons'],
};

export default nextConfig;