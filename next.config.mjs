/** @type {import('next').NextConfig} */
const nextConfig = {
    // next.config.js
  
    experimental: {
      missingSuspenseWithCSRBailout: false,
    },
  };
  
  export default nextConfig;