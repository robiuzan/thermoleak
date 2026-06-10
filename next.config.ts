import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // emit a static ./out site (no Node server needed on cPanel)
  trailingSlash: true, // /services/ -> /services/index.html (Apache-friendly)
  images: { unoptimized: true }, // next/image works without a server
};

export default nextConfig;
