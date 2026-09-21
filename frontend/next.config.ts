import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// Catch photos are served from the project's public Supabase Storage bucket (see lib/supabase/storage.ts). next/image
// only optimises remote images whose URL matches a pattern here, so allow exactly that bucket on this project's host.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

const nextConfig: NextConfig = {
  // Catch photos go through a server action. The wizard shrinks them to a JPEG well under 1MB (lib/photo/prepare-upload.ts),
  // but one the browser can't decode (HEIC in Chrome) is sent as is, so allow up to Vercel's 4.5MB request limit.
  experimental: {
    serverActions: { bodySizeLimit: "4mb" },
  },
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

// Points next-intl at i18n/request.ts, which picks the locale and messages for each request.
const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
