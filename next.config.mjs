/** @type {import('next').NextConfig} */
const nextConfig = {
  agentRules: false,
  compress: true,
  devIndicators: false,
  poweredByHeader: false,
  outputFileTracingRoot: process.cwd(),
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
