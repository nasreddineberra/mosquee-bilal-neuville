/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    qualities: [75, 85],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'mawaqit.net',
      },
      {
        protocol: 'https',
        hostname: 'ugbkbsorcrmnhfplprkb.supabase.co',
      },
    ],
  },
  turbopack: {},
};

export default nextConfig;
