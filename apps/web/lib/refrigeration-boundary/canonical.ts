/*
 * Canonical JSON for the Refrigeration Consequence Boundary simulation: keys sorted by code point,
 * undefined members dropped, no whitespace. (GCEA sorts keys with localeCompare; for the ASCII keys
 * used here the order is the same.) It has no dependencies, so the browser verifier and the server
 * recorder hash identical bytes.
 */
export function canonical(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  return `{${Object.entries(value as Record<string, unknown>).filter(([, v]) => v !== undefined).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)).map(([k, v]) => `${JSON.stringify(k)}:${canonical(v)}`).join(',')}}`;
}
