/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
  images: {
    domains: [
      process.env.INTERNAL_URL, 
      process.env.NEXT_PUBLIC_S3_STATIC_URL,
      process.env.NEXT_PUBLIC_S3_LEARN_URL,
    ],
  },
};

module.exports = nextConfig;
