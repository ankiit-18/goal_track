import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prisma 7 + Turbopack: bundling @prisma/client avoids stale `runtime/library.js` resolution.
};

export default nextConfig;

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
