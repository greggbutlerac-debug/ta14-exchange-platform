import type { TA14LinkId } from "@/lib/academy/ta14-24-link-canon";

const LINK_ID_PATTERN = /^TA14-LINK-(0[1-9]|1[0-9]|2[0-4])$/;

export function isTA14LinkId(value: string): value is TA14LinkId {
  return LINK_ID_PATTERN.test(value);
}

export function getTA14ProvenanceIntakeHref(
  linkId?: TA14LinkId | null,
): string {
  const base =
    "/academy/24-link-architecture/provenance/intake";

  if (!linkId) {
    return base;
  }

  return `${base}?link=${encodeURIComponent(linkId)}`;
}

export function readTA14ProvenanceLinkPrefill(
  value: string | null | undefined,
): TA14LinkId | null {
  if (!value || !isTA14LinkId(value)) {
    return null;
  }

  return value;
}
