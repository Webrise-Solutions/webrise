"use client";

import { useState } from "react";
import { Icon } from "@/components/shared/Icon";

/**
 * Escapes one CSV cell.
 *
 * Two separate jobs. Quoting handles commas, quotes and newlines so the file
 * parses. The leading apostrophe handles the other thing: a cell starting
 * =, +, - or @ is treated as a formula by Excel and Sheets, so a value like
 * `=cmd|...` becomes executable on open. Prefixing neutralises it.
 */
function csvCell(value: unknown): string {
  const text = value === null || value === undefined ? "" : String(value);
  const guarded = /^[=+\-@\t\r]/.test(text) ? `'${text}` : text;
  return `"${guarded.replace(/"/g, '""')}"`;
}

export function ExportCsvButton<Row extends Record<string, unknown>>({
  rows,
  columns,
  filename,
  label = "Export CSV",
}: {
  rows: Row[];
  columns: { key: keyof Row & string; header: string }[];
  filename: string;
  label?: string;
}) {
  const [done, setDone] = useState(false);

  function download() {
    const header = columns.map((column) => csvCell(column.header)).join(",");
    const body = rows.map((row) => columns.map((column) => csvCell(row[column.key])).join(","));

    // The BOM is what makes Excel read the file as UTF-8 rather than mangling
    // any non-ASCII character in an email address or page path.
    const csv = "﻿" + [header, ...body].join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    setDone(true);
    window.setTimeout(() => setDone(false), 2500);
  }

  return (
    <button
      type="button"
      onClick={download}
      disabled={rows.length === 0}
      className="inline-flex items-center gap-2 rounded-[10px] border border-line bg-white px-4 py-3 text-sm font-semibold text-ink transition-colors hover:bg-offwhite disabled:opacity-50"
    >
      <Icon name={done ? "check" : "arrow-right"} size={16} className={done ? "" : "rotate-90"} />
      {done ? "Downloaded" : `${label} (${rows.length})`}
    </button>
  );
}
