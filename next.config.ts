import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone is for VPS/Docker; Vercel uses its own runtime.
  ...(process.env.VERCEL ? {} : { output: "standalone" as const }),
  images: {
    formats: ["image/avif", "image/webp"],
  },
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;
