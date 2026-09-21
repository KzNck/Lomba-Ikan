import type { NextConfig } from "next";

// Catch photos are served from the project's public Supabase Storage bucket (see lib/supabase/storage.ts). next/image
// only optimises remote images whose URL matches a pattern here, so allow exactly that bucket on this project's host.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: supabaseUrl
      ? [
          {
            protocol: "https",
            hostname: new URL(supabaseUrl).hostname,
            port: "",
            pathname: "/storage/v1/object/public/catch-photos/**",
            search: "",
          },
        ]
      : [],
  },
};

export default nextConfig;
