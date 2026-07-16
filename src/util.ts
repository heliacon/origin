/** Shared primitives used across the build modules. */

export const CANON = "https://heliacon.com";

export type Dict = Record<string, any>;

/** HTML-escape for text interpolated into markup. */
export const esc = (s: unknown): string =>
  String(s ?? "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Collapse runs of whitespace to a single space and trim. */
export const collapse = (s: unknown): string => String(s ?? "").split(/\s+/).join(" ").trim();

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** YYYY-MM-DD -> "4 July 2026". Passes through anything it cannot parse. */
export function fmtDate(d: unknown): string {
  const [y, m, day] = String(d ?? "").split("-");
  return m ? `${Number(day)} ${MONTHS[Number(m) - 1]} ${y}` : String(d ?? "");
}

/** Slug -> "Title Case" for a fallback label. */
export const titleCase = (s: string): string =>
  s.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

/** A stable, URL-safe anchor id from a heading string. */
export const slugify = (s: string): string =>
  String(s ?? "").toLowerCase().replace(/<[^>]+>/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
