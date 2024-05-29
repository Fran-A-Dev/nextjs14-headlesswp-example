const { withAtlasConfig } = require("@wpengine/atlas-next");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your existing Next.js config
};

module.exports = withAtlasConfig(nextConfig);
