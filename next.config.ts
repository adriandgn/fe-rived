import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
      },
      {
        protocol: "http",
        hostname: "fake.url",
      },
      {
        protocol: "http",
        hostname: "example.com",
      },
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "54321",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: "https://api-rived.vercel.app/api/v1/:path*",
      },
    ];
  },
};

export default nextConfig;
