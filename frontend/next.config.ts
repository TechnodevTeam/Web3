import type { NextConfig } from "next";
<<<<<<< HEAD

const nextConfig: NextConfig = {};

export default nextConfig;
=======
const nextConfig: NextConfig = {
  reactCompiler: false,
  allowedDevOrigins: ["192.168.100.1"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};
export default nextConfig;
>>>>>>> 9b52dbf99336458107992df2ce155f4c883addfd
