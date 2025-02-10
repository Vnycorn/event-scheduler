import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  rewrites: async () => {
    return [
      {
        source: "/api/:path*",
        destination:
          process.env.NODE_ENV === "development"
            ? `http://127.0.0.1:8000${process.env.API_STR}/:path*`
            : `${process.env.NEXT_PUBLIC_API_URL}${process.env.API_STR}/:path*`,
      },
    ];
  },
};

export default nextConfig;
