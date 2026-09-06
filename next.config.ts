import type { NextConfig } from "next";

// Derived at build time from the same env var the app already reads —
// kept in sync automatically rather than hardcoding the project ref, so
// this doesn't quietly drift if the Supabase project ever changes.
const supabaseOrigin = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseWsOrigin = supabaseOrigin.replace(/^https:/, "wss:");

const csp = [
  "default-src 'self'",
  // Next.js's own inline bootstrap/RSC-payload scripts and React's inline
  // `style={{...}}` attributes need these — this isn't a nonce-based
  // strict CSP, just a baseline that won't break the app.
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self'",
  // Review/business photos and avatars mostly come from Supabase Storage,
  // but some real rows in the live database use Unsplash stock photos as
  // placeholders; map tiles come from OpenStreetMap
  // (interactive-ghana-map.tsx).
  `img-src 'self' data: ${supabaseOrigin} https://images.unsplash.com https://*.tile.openstreetmap.org`,
  // REST/Auth/Storage calls and the realtime websocket both go to the
  // same Supabase project origin.
  `connect-src 'self' ${supabaseOrigin} ${supabaseWsOrigin}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
]
  .filter(Boolean)
  .join("; ");

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  async headers() {
    return [
      {
        // Applies to every route, including API/server actions.
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          // Older/non-CSP-aware clients: same protection as frame-ancestors above.
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          // Nothing on this dashboard uses any of these browser features.
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
