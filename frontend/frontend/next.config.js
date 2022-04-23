/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
  images: {
    domains: [
      "webapp", 
      "lamyai-image-static-bucket-fqkmr5.s3.ap-northeast-1.amazonaws.com",
      "lamyai-image-learn-bucket-fqkmr5.s3.ap-northeast-1.amazonaws.com",
    ],
  },
};

module.exports = nextConfig;
