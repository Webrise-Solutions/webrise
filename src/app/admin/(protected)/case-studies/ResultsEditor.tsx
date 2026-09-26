"use client";

import { useState } from "react";
import { Icon } from "@/components/shared/Icon";
import { inputClass } from "@/components/admin/fields";

export type ResultRow = { metric: string; value: string; label: string };

/**
 * Edits the `results` jsonb column as rows rather than raw JSON, and serialises
 * to a hidden input so the Server Action receives one parseable field.
 */
export function ResultsEditor({ initial }: { initial: ResultRow[] }) {
  const [rows, setRows] = useState<ResultRow[]>(initial);

  const update = (index: number, key: keyof ResultRow, value: string) =>
    setRows((current) => current.map((row, i) => (i === index ? { ...row, [key]: value } : row)));

  const complete = rows.filter((row) => row.metric.trim() && row.value.trim());

  return (
    <div>
      <input type="hidden" name="results" value={JSON.stringify(complete)} />

      <div className="grid gap-3">
        {rows.map((row, index) => (
          <div
            key={index}
            className="grid gap-2 rounded-xl border border-line-soft bg-offwhite p-3 sm:grid-cols-[1fr_120px_1fr_auto]"
          >
            <input
              aria-label={`Result ${index + 1} metric`}
              value={row.metric}
              onChange={(event) => update(index, "metric", event.target.value)}
              placeholder="Organic traffic"
              maxLength={80}
              className={`${inputClass} py-2.5 text-sm`}
            />
            <input
              aria-label={`Result ${index + 1} value`}
              value={row.value}
              onChange={(event) => update(index, "value", event.target.value)}
              placeholder="+212%"
              maxLength={40}
              className={`${inputClass} py-2.5 text-sm font-semibold`}
            />
            <input
              aria-label={`Result ${index + 1} note`}
              value={row.label}
              onChange={(event) => update(index, "label", event.target.value)}
              placeholder="in 6 months (optional)"
              maxLength={120}
              className={`${inputClass} py-2.5 text-sm`}
            />
            <button
              type="button"
              onClick={() => setRows((current) => current.filter((_, i) => i !== index))}
              aria-label={`Remove result ${index + 1}`}
              className="grid h-10 w-10 place-items-center rounded-lg border border-line text-muted-foreground transition-colors hover:border-rust hover:text-rust"
            >
              <Icon name="plus" size={16} className="rotate-45" />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setRows((current) => [...current, { metric: "", value: "", label: "" }])}
        disabled={rows.length >= 12}
        className="mt-3 inline-flex items-center gap-2 rounded-lg border border-line px-3.5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-offwhite disabled:opacity-50"
      >
        <Icon name="plus" size={16} className="shrink-0" />
        Add result
      </button>

      <p className="mt-2 text-[13px] text-muted-foreground">
        Rows missing a metric or value are dropped on save. {complete.length} of {rows.length} will
        be stored.
      </p>
    </div>
  );
}
