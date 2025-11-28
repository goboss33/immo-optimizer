import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: {
    // @ts-ignore - buildActivity is valid in runtime but missing in some type definitions
    buildActivity: false,
    // @ts-ignore
    appIsrStatus: false,
  },
};

export default nextConfig;
