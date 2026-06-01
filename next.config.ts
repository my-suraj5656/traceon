import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  cacheOnFrontEndNav: false,
  aggressiveFrontEndNavCaching: false,
  reloadOnOnline: true,
  workboxOptions: {
    disableDevLogs: true,
    // Never cache authenticated routes — SW would serve cached redirect-to-login
    navigateFallbackDenylist: [/^\/superadmin/, /^\/admin/, /^\/employee/, /^\/api/],
  },
});

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  reactStrictMode: false,
  turbopack: {},
};

export default withPWA(nextConfig);
