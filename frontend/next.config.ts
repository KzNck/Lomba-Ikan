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
    // Keep a visited dashboard page in the browser for 30s, so going back to it is instant instead of a fresh
    // server render. Every page is per-user (RLS through the session cookie), so this client-side copy is the safe
    // place to cache it. Server Actions that change data call revalidatePath, which clears these copies, so a
    // user's own edits always show at once; changes made by someone else show within 30s or on a refresh.
    // `static` covers pages the sidebar prefetches in full (prefetch={true}): kept 60s, the same window the server
    // cache gives catches and transactions (lib/supabase/cached.ts), instead of the 5-minute default.
    staleTimes: { dynamic: 30, static: 60 },
  },
  // The service worker must never be served from an HTTP cache, or a fix to it would reach users late.
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          { key: 'Content-Type', value: 'application/javascript; charset=utf-8' },
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
          { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self'" },
        ],
      },
    ]
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
