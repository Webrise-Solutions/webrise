"use client";

import { useState } from "react";
import { Icon } from "@/components/shared/Icon";
import { hintClass, inputClass, labelClass } from "@/components/admin/fields";
import { addTag, addTagList, MAX_TAGS, MAX_TAG_LENGTH } from "@/lib/tags";

/**
 * WordPress-style tag box: type a tag, press Enter or comma, get a chip.
 *
 * Serialises to one JSON field so the Server Action receives a single value it
 * can validate, rather than repeated inputs of the same name.
 */
export function TagsInput({
  name,
  label,
  defaultValue,
  available = true,
}: {
  name: string;
  label: string;
  defaultValue?: string[] | null;
  available?: boolean;
}) {
  const [tags, setTags] = useState<string[]>(defaultValue ?? []);
  const [draft, setDraft] = useState("");

  function commit(raw: string) {
    setTags((current) => addTag(current, raw));
    setDraft("");
  }

  return (
    <div>
      <label htmlFor={`${name}-input`} className={labelClass}>
        {label}
      </label>

      <input type="hidden" name={name} value={JSON.stringify(tags)} />

      {tags.length ? (
        <ul className="mb-2 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <li key={tag}>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-soft py-1 pl-3 pr-1.5 text-[13px] font-semibold text-teal">
                {tag}
                <button
                  type="button"
                  onClick={() => setTags(tags.filter((t) => t !== tag))}
                  aria-label={`Remove tag ${tag}`}
                  disabled={!available}
                  className="grid h-5 w-5 place-items-center rounded-full text-teal transition-colors hover:bg-white disabled:opacity-50"
                >
                  <Icon name="plus" size={12} className="rotate-45" />
                </button>
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      <input
        id={`${name}-input`}
        type="text"
        value={draft}
        disabled={!available || tags.length >= MAX_TAGS}
        maxLength={MAX_TAG_LENGTH}
        onChange={(event) => {
          // A pasted comma-separated list becomes several chips at once.
          if (event.target.value.includes(",")) {
            const parts = event.target.value.split(",");
            setTags((current) => addTagList(current, parts.slice(0, -1).join(",")));
            setDraft(parts[parts.length - 1]?.trimStart() ?? "");
            return;
          }
          setDraft(event.target.value);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            // Never let Enter in the tag box submit the whole editor.
            event.preventDefault();
            commit(draft);
          } else if (event.key === "Backspace" && !draft && tags.length) {
            setTags(tags.slice(0, -1));
          }
        }}
        onBlur={() => commit(draft)}
        placeholder={
          tags.length >= MAX_TAGS ? `Limit of ${MAX_TAGS} reached` : "Type a tag and press Enter"
        }
        className={`${inputClass} disabled:cursor-not-allowed disabled:bg-sand disabled:text-muted-foreground`}
      />

      <p className={hintClass}>
        {available
          ? `Enter or comma to add, Backspace to remove the last. ${tags.length}/${MAX_TAGS}.`
          : "Unavailable: this database has no tags column yet. Run migration 20260825180000_editor_fields.sql."}
      </p>
    </div>
  );
}
