import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    remotePatterns: [
      new URL("https://cdn-1.aki.kg/st_gallery/24/984124.7d8b588e322af6c4dc7ce1a0c29cba70.jpg"),
      new URL("https://www.siluxgc.com/image/2024-01-13/1195823654929203200.jpg"),
      new URL("https://cdn.ruwiki.ru/commonswiki/files/thumb/2/27/BHU_fantan.jpg/1200px-BHU_fantan.jpg"),
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
