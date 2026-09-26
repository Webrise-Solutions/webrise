"use server";

import { randomUUID } from "node:crypto";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireAdmin } from "@/lib/admin-auth";

/** Buckets an admin may upload into. Never take the bucket from the client unchecked. */
const BUCKETS = {
  "blog-media": "blog-media",
  "case-study-media": "case-study-media",
  // Service hero imagery is brand material rather than editorial content.
  "brand-assets": "brand-assets",
  "testimonial-media": "testimonial-media",
  "team-media": "team-media",
} as const;

export type UploadBucket = keyof typeof BUCKETS;

/**
 * SVG is deliberately excluded: the buckets are public, so an SVG served from
 * the Supabase domain could carry script.
 */
const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
};

const MAX_BYTES = 5 * 1024 * 1024;

export type UploadResult = { url: string } | { error: string };

export async function uploadImage(formData: FormData): Promise<UploadResult> {
  // Server Actions are public endpoints; the layout guard does not cover them.
  await requireAdmin();

  const bucketKey = (formData.get("bucket") ?? "").toString();
  if (!(bucketKey in BUCKETS)) {
    return { error: "Unknown upload destination." };
  }
  const bucket = BUCKETS[bucketKey as UploadBucket];

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choose an image to upload." };
  }

  if (file.size > MAX_BYTES) {
    const mb = (file.size / 1024 / 1024).toFixed(1);
    return { error: `That image is ${mb}MB. The limit is 5MB.` };
  }

  const extension = EXTENSIONS[file.type];
  if (!extension) {
    return { error: "Use a JPG, PNG, WebP, AVIF or GIF." };
  }

  // The stored name comes from a uuid, never the uploaded filename, so a
  // crafted name cannot escape the bucket path or collide with an existing file.
  const path = `${new Date().getFullYear()}/${randomUUID()}.${extension}`;

  const { error } = await supabaseAdmin.storage
    .from(bucket)
    .upload(path, file, { contentType: file.type, cacheControl: "31536000", upsert: false });

  if (error) {
    console.error("[admin/upload] failed", error);
    return { error: "Upload failed. Please try again." };
  }

  const {
    data: { publicUrl },
  } = supabaseAdmin.storage.from(bucket).getPublicUrl(path);

  return { url: publicUrl };
}
