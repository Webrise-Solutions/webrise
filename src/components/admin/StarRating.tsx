"use client";

import { useState } from "react";
import { Icon } from "@/components/shared/Icon";
import { hintClass, labelClass } from "@/components/admin/fields";

/**
 * 1–5 star picker.
 *
 * Radio inputs under the stars rather than buttons: keyboard users get arrow
 * keys and a real focus ring for free, and the value posts with the form
 * without any JavaScript of its own.
 */
export function StarRating({
  name,
  label,
  defaultValue,
}: {
  name: string;
  label: string;
  defaultValue?: number | null;
}) {
  const [rating, setRating] = useState<number>(defaultValue ?? 0);
  const [hovered, setHovered] = useState<number>(0);
  const shown = hovered || rating;

  return (
    <div>
      <span className={labelClass}>{label}</span>

      <div
        className="flex items-center gap-1"
        role="radiogroup"
        aria-label={label}
        onMouseLeave={() => setHovered(0)}
      >
        {[1, 2, 3, 4, 5].map((value) => (
          <label
            key={value}
            onMouseEnter={() => setHovered(value)}
            className="cursor-pointer rounded p-0.5 focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-teal"
            title={`${value} star${value === 1 ? "" : "s"}`}
          >
            <input
              type="radio"
              name={name}
              value={value}
              checked={rating === value}
              onChange={() => setRating(value)}
              className="sr-only"
            />
            <Icon
              name="star"
              size={26}
              className={value <= shown ? "text-[#F5B841]" : "text-line"}
              // A filled star is the point of the control, not decoration.
              style={value <= shown ? { fill: "currentColor" } : undefined}
            />
            <span className="sr-only">
              {value} star{value === 1 ? "" : "s"}
            </span>
          </label>
        ))}

        {rating > 0 ? (
          <button
            type="button"
            onClick={() => setRating(0)}
            className="ml-2 text-[13px] font-semibold text-muted-foreground hover:text-rust"
          >
            Clear
          </button>
        ) : null}
      </div>

      <p className={hintClass}>
        {rating > 0 ? `${rating} of 5.` : "No rating. The stars stay hidden on the site."}
      </p>
    </div>
  );
}
