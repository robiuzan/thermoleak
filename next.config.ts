import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // emit a static ./out site — deployed to Cloudflare Pages (project 'thermoleak')
  trailingSlash: true, // /services/ -> /services/index.html (directory-style URLs)
  images: { unoptimized: true }, // next/image works without a server
};

export default nextConfig;
