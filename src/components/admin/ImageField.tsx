"use client";

import { useRef, useState, useTransition } from "react";
import { Icon } from "@/components/shared/Icon";
import { inputClass, labelClass, hintClass } from "@/components/admin/fields";
import { uploadImage, type UploadBucket } from "@/actions/admin/upload";

/** Keep in step with MAX_BYTES in src/actions/admin/upload.ts. */
const MAX_BYTES = 5 * 1024 * 1024;

/**
 * Cover image picker: paste a URL, or upload a file from this computer.
 *
 * Whichever route is used, the value ends up in a single named input, so the
 * editor's Server Action keeps receiving one plain URL string.
 */
export function ImageField({
  name,
  label,
  bucket,
  defaultValue,
  altName,
  altDefaultValue,
  altAvailable = true,
}: {
  name: string;
  label: string;
  bucket: UploadBucket;
  defaultValue?: string | null;
  /** When set, an alt-text input is rendered and submitted under this name. */
  altName?: string;
  altDefaultValue?: string | null;
  altAvailable?: boolean;
}) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);
  const [broken, setBroken] = useState(false);

  function handleFile(file: File | undefined) {
    if (!file) return;
    setError(undefined);

    // Checked here as well as on the server: an oversized body is rejected by
    // the framework before the action runs, so the friendly message has to come
    // from the client for the user to ever see it.
    if (file.size > MAX_BYTES) {
      setError(`That image is ${(file.size / 1024 / 1024).toFixed(1)}MB. The limit is 5MB.`);
      if (fileRef.current) fileRef.current.value = "";
      return;
    }

    const formData = new FormData();
    formData.set("file", file);
    formData.set("bucket", bucket);

    startTransition(async () => {
      const result = await uploadImage(formData);
      if ("error" in result) {
        setError(result.error);
      } else {
        setUrl(result.url);
        setBroken(false);
      }
      if (fileRef.current) fileRef.current.value = "";
    });
  }

  return (
    <div>
      <span className={labelClass}>{label}</span>

      {/* The single source of truth submitted with the form. */}
      <input type="hidden" name={name} value={url} />

      {url ? (
        <div className="mb-3 flex items-start gap-4 rounded-xl border border-line-soft bg-offwhite p-3">
          {broken ? (
            <span className="grid h-20 w-28 flex-none place-items-center rounded-lg border border-line bg-white text-muted-foreground">
              <Icon name="monitor" size={22} />
            </span>
          ) : (
            // Plain <img>: the bucket host is not configured for next/image, and
            // this is an admin-only preview.
            <img
              src={url}
              alt=""
              onError={() => setBroken(true)}
              className="h-20 w-28 flex-none rounded-lg border border-line bg-white object-cover"
            />
          )}

          <div className="min-w-0 flex-1">
            <p className="break-all font-mono text-[12px] leading-relaxed text-muted-foreground">
              {url}
            </p>
            {broken ? (
              <p className="mt-1 text-[13px] text-rust">That URL did not load as an image.</p>
            ) : null}
            <button
              type="button"
              onClick={() => {
                setUrl("");
                setBroken(false);
              }}
              className="mt-2 inline-flex items-center gap-1.5 text-[13px] font-semibold text-rust hover:underline"
            >
              <Icon name="plus" size={13} className="rotate-45" />
              Remove
            </button>
          </div>
        </div>
      ) : null}

      <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
        <input
          type="url"
          aria-label={`${label} URL`}
          value={url}
          onChange={(event) => {
            setUrl(event.target.value);
            setBroken(false);
          }}
          placeholder="https://..."
          className={inputClass}
        />

        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={pending}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-line bg-white px-4 py-3 text-sm font-semibold text-ink transition-colors hover:bg-offwhite disabled:opacity-60"
        >
          <Icon name="plus" size={16} className="shrink-0" />
          {pending ? "Uploading..." : "Upload"}
        </button>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
        className="sr-only"
        tabIndex={-1}
        onChange={(event) => handleFile(event.target.files?.[0])}
      />

      {error ? (
        <p role="alert" className="mt-1.5 text-[13px] text-rust">
          {error}
        </p>
      ) : (
        <p className={hintClass}>Paste a URL, or upload a JPG, PNG, WebP, AVIF or GIF up to 5MB.</p>
      )}

      {altName ? (
        <div className="mt-3">
          <label htmlFor={altName} className={labelClass}>
            Image alt text
          </label>
          <input
            id={altName}
            name={altName}
            type="text"
            maxLength={200}
            defaultValue={altDefaultValue ?? ""}
            disabled={!altAvailable}
            placeholder="Describe the image for screen readers"
            className={`${inputClass} disabled:cursor-not-allowed disabled:bg-sand disabled:text-muted-foreground`}
          />
          <p className={hintClass}>
            {altAvailable
              ? "Leave blank only if the image is purely decorative."
              : "Unavailable: this database has no cover_image_alt column yet. Run migration 20260825180000_editor_fields.sql."}
          </p>
        </div>
      ) : null}
    </div>
  );
}
