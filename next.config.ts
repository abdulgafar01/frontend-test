import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Enable React strict mode
  reactStrictMode: true,
  
  // Webpack configuration to handle PDF.js dependencies
  webpack: (config, { isServer }) => {
    // Disable canvas and encoding polyfills (not needed for PDF.js)
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    
    // Important: return the modified config
    return config;
  },
};



export default nextConfig;
