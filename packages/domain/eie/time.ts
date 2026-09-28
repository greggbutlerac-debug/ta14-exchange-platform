/**
 * Time parsing for the Node contract. This file defines a timestamp format, not a threshold:
 * only ISO 8601 date-times with an explicit zone are parseable; anything else is rejected.
 */
const ISO_8601_WITH_ZONE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,9})?(Z|[+-]\d{2}:\d{2})$/;

export const MS_PER_SECOND = 1000;

/** Epoch milliseconds, or null when the value is not an unambiguous zoned ISO 8601 date-time. */
export function parseInstant(value: unknown): number | null {
  if (typeof value !== "string" || !ISO_8601_WITH_ZONE.test(value)) return null;
  const ms = Date.parse(value);
  return Number.isFinite(ms) ? ms : null;
}
