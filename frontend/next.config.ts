import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  eslint: {
    ignoreDuringBuilds: true,
  },
  // sassOptions: {
  //   implementation: 'sass-embedded',
  // },
  /* config options here */
};

export default nextConfig;
