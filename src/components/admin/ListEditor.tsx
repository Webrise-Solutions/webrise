"use client";

import { useState } from "react";
import { Icon } from "@/components/shared/Icon";
import { hintClass, inputClass, labelClass } from "@/components/admin/fields";

/**
 * Repeatable single-line entries (a service's deliverables), serialised to one
 * JSON field so the Server Action validates a single value.
 */
export function ListEditor({
  name,
  label,
  hint,
  placeholder,
  initial,
  max = 20,
}: {
  name: string;
  label: string;
  hint?: string;
  placeholder?: string;
  initial: string[];
  max?: number;
}) {
  const [items, setItems] = useState<string[]>(initial.length ? initial : [""]);

  const update = (index: number, value: string) =>
    setItems((current) => current.map((item, i) => (i === index ? value : item)));

  const filled = items.map((item) => item.trim()).filter(Boolean);

  return (
    <div>
      <span className={labelClass}>{label}</span>
      <input type="hidden" name={name} value={JSON.stringify(filled)} />

      <div className="grid gap-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <span className="w-6 flex-none text-center font-mono text-[12px] text-muted-foreground">
              {index + 1}
            </span>
            <input
              aria-label={`${label} ${index + 1}`}
              value={item}
              onChange={(event) => update(index, event.target.value)}
              placeholder={placeholder}
              maxLength={160}
              className={`${inputClass} py-2.5 text-sm`}
            />
            <button
              type="button"
              onClick={() => setItems((current) => current.filter((_, i) => i !== index))}
              aria-label={`Remove ${label} ${index + 1}`}
              className="grid h-10 w-10 flex-none place-items-center rounded-lg border border-line text-muted-foreground transition-colors hover:border-rust hover:text-rust"
            >
              <Icon name="plus" size={16} className="rotate-45" />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setItems((current) => [...current, ""])}
        disabled={items.length >= max}
        className="mt-2.5 inline-flex items-center gap-2 rounded-lg border border-line px-3.5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-offwhite disabled:opacity-50"
      >
        <Icon name="plus" size={16} className="shrink-0" />
        Add
      </button>

      <p className={hintClass}>
        {hint ? `${hint} ` : ""}
        Blank rows are dropped on save. {filled.length} of {max} used.
      </p>
    </div>
  );
}

export type Step = { title: string; description: string };

/** Repeatable {title, description} pairs for a service's process. */
export function StepsEditor({
  name,
  label,
  initial,
  max = 12,
}: {
  name: string;
  label: string;
  initial: Step[];
  max?: number;
}) {
  const [steps, setSteps] = useState<Step[]>(initial);

  const update = (index: number, key: keyof Step, value: string) =>
    setSteps((current) =>
      current.map((step, i) => (i === index ? { ...step, [key]: value } : step)),
    );

  const move = (index: number, delta: number) =>
    setSteps((current) => {
      const target = index + delta;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      const [moved] = next.splice(index, 1);
      next.splice(target, 0, moved!);
      return next;
    });

  const complete = steps.filter((step) => step.title.trim());

  return (
    <div>
      <span className={labelClass}>{label}</span>
      <input type="hidden" name={name} value={JSON.stringify(complete)} />

      <div className="grid gap-3">
        {steps.map((step, index) => (
          <div key={index} className="rounded-xl border border-line-soft bg-offwhite p-3">
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 flex-none place-items-center rounded-full bg-teal-soft font-mono text-[12px] font-semibold text-teal">
                {String(index + 1).padStart(2, "0")}
              </span>
              <input
                aria-label={`Step ${index + 1} title`}
                value={step.title}
                onChange={(event) => update(index, "title", event.target.value)}
                placeholder="Discovery"
                maxLength={120}
                className={`${inputClass} py-2 text-sm font-semibold`}
              />
              <button
                type="button"
                onClick={() => move(index, -1)}
                disabled={index === 0}
                aria-label={`Move step ${index + 1} up`}
                className="grid h-9 w-9 flex-none place-items-center rounded-lg border border-line text-muted-foreground transition-colors hover:text-teal disabled:opacity-40"
              >
                <Icon name="chevron-down" size={15} className="rotate-180" />
              </button>
              <button
                type="button"
                onClick={() => move(index, 1)}
                disabled={index === steps.length - 1}
                aria-label={`Move step ${index + 1} down`}
                className="grid h-9 w-9 flex-none place-items-center rounded-lg border border-line text-muted-foreground transition-colors hover:text-teal disabled:opacity-40"
              >
                <Icon name="chevron-down" size={15} />
              </button>
              <button
                type="button"
                onClick={() => setSteps((current) => current.filter((_, i) => i !== index))}
                aria-label={`Remove step ${index + 1}`}
                className="grid h-9 w-9 flex-none place-items-center rounded-lg border border-line text-muted-foreground transition-colors hover:border-rust hover:text-rust"
              >
                <Icon name="plus" size={15} className="rotate-45" />
              </button>
            </div>
            <textarea
              aria-label={`Step ${index + 1} description`}
              value={step.description}
              onChange={(event) => update(index, "description", event.target.value)}
              placeholder="What happens in this step."
              rows={2}
              maxLength={600}
              className={`${inputClass} mt-2 py-2 text-sm`}
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setSteps((current) => [...current, { title: "", description: "" }])}
        disabled={steps.length >= max}
        className="mt-2.5 inline-flex items-center gap-2 rounded-lg border border-line px-3.5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-offwhite disabled:opacity-50"
      >
        <Icon name="plus" size={16} className="shrink-0" />
        Add step
      </button>

      <p className={hintClass}>
        Steps without a title are dropped on save. {complete.length} of {max} used.
      </p>
    </div>
  );
}
