/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.youtube.com",
        port: "",
        pathname: "/vi/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
    ],
    // 画像の最適化を無効にする設定 Vercelの無料プランでは1000枚までしか最適化できない。
    unoptimized: true,
  },
};

module.exports = nextConfig;
