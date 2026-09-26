import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root — otherwise Next.js infers it from the nearest
  // lockfile, which can incorrectly resolve to a parent directory (e.g. a
  // stray package-lock.json in the user's home folder outside this repo).
  turbopack: {
    root: import.meta.dirname,
  },
  async redirects() {
    return [
      {
        // The case studies lived here before the nav settled on /work. Kept
        // permanent so any link already shared keeps resolving.
        source: "/case-studies",
        destination: "/work",
        permanent: true,
      },
      {
        source: "/terms-and-conditions",
        destination: "/terms-of-service",
        permanent: true,
      },
      {
        source: "/case-studies/:slug",
        destination: "/work/:slug",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        // Cover, gallery and before/after images are served from the project's
        // public storage buckets. Without this, next/image refuses the host and
        // large editorial visuals have to ship as unoptimised <img> tags.
        protocol: "https",
        hostname: "jkgrdfoeyphxrriuzvlk.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  experimental: {
    serverActions: {
      // Cover-image uploads travel through a Server Action, and the default cap
      // is 1MB — small enough that an ordinary photo fails. The app enforces its
      // own 5MB rule in src/actions/admin/upload.ts; this leaves headroom for
      // multipart overhead so that rule is what users actually hit.
      bodySizeLimit: "6mb",
    },
  },
};

export default nextConfig;
