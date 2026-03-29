import { configDotenv } from "dotenv";
import type { NextConfig } from "next";
import path from "path";

// Load root .env FIRST
configDotenv({
  path: path.resolve(process.cwd(), "../../.env"),
});

const nextConfig: NextConfig = {
  transpilePackages: ["@repo/ui"],
  typescript: {
    ignoreBuildErrors: true,
  },
  output: "standalone"
};

export default nextConfig;
