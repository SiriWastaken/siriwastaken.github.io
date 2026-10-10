import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // GitHub Pages serves static files only: no image optimizer, no server.
  output: "export",
  // /projects/x/index.html, so each project URL resolves on Pages.
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
