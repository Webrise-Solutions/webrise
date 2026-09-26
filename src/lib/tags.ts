export const MAX_TAGS = 12;
export const MAX_TAG_LENGTH = 40;

/**
 * Adds one tag to a list, applying the editor's rules: trim, drop a leading
 * "#", cap the length, ignore blanks, refuse case-insensitive duplicates and
 * stop at the limit. Returns the list unchanged when the tag is not accepted.
 *
 * Pure and exported so the rules can be tested without a browser — the input
 * itself is disabled whenever the tags column is missing.
 */
export function addTag(tags: string[], raw: string): string[] {
  const cleaned = raw.trim().replace(/^#/, "").trim().slice(0, MAX_TAG_LENGTH);

  if (!cleaned) return tags;
  if (tags.length >= MAX_TAGS) return tags;
  if (tags.some((tag) => tag.toLowerCase() === cleaned.toLowerCase())) return tags;

  return [...tags, cleaned];
}

/** Splits a pasted "a, b, c" string into accepted tags. */
export function addTagList(tags: string[], raw: string): string[] {
  return raw.split(",").reduce(addTag, tags);
}
