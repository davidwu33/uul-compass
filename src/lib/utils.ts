import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const SHORT_MONTHS: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
};

/**
 * Parse a date string in either ISO format ("2026-04-07") or short display format ("Apr 7").
 * Returns a local Date at midnight, or null if unparseable.
 */
function parseDateString(dateStr: string): Date | null {
  if (!dateStr) return null;
  // ISO format: "2026-04-07"
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [y, m, d] = dateStr.split("-").map(Number);
    return new Date(y, m - 1, d);
  }
  // Short display format: "Apr 7"
  const parts = dateStr.split(" ");
  if (parts.length === 2 && SHORT_MONTHS[parts[0]] !== undefined) {
    const month = SHORT_MONTHS[parts[0]];
    const day = parseInt(parts[1]);
    if (!isNaN(day)) return new Date(new Date().getFullYear(), month, day);
  }
  return null;
}

/**
 * Format a date string (ISO "2026-04-07" or short "Apr 7") to a short display label.
 * Short strings are returned as-is. ISO strings are converted.
 * Returns undefined for null/undefined input — the UI treats this as "no due date".
 */
export function formatDueDate(dateStr: string | null | undefined): string | undefined {
  if (!dateStr) return undefined;
  const parsed = parseDateString(dateStr);
  if (!parsed) return dateStr;
  return parsed.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Check if a date string (ISO or short format) is in the past.
 * Uses local midnight so "today" is never considered overdue.
 */
export function isOverdue(dateStr: string | null | undefined): boolean {
  if (!dateStr) return false;
  const due = parseDateString(dateStr);
  if (!due) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return due < today;
}

/**
 * Calculate the current day number of the PMI (1-indexed).
 * Returns 1 if the project hasn't started yet.
 */
export function calcDayNumber(startDateIso: string, totalDays = 100): number {
  const start = parseDateString(startDateIso);
  if (!start) return 1;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(1, Math.min(totalDays, diff + 1));
}
