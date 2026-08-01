/**
 * TA-14 Execution Artifact PDF Engine
 *
 * Dependency-free PDF generator for CanonicalExecutionArtifact records.
 * Produces deterministic, inspectable, downloadable PDF proof packages.
 *
 * Governing chain:
 * Reality -> Record -> Continuity -> Admissibility -> Binding -> Commit -> Execution -> Outcome
 *
 * Governing principle:
 * No admissible evidence. No admissible execution.
 */

import {
  CHAIN_LINKS,
  canonicalStringify,
  exportCanonicalJson,
  validateArtifact,
  type ActorReference,
  type ArtifactDetermination,
  type ArtifactGateResult,
  type AuthoritySnapshot,
  type CanonicalExecutionArtifact,
  type ChainLink,
  type DisclosureLevel,
  type EvidenceItem,
  type ExecutionReceipt,
  type GateLedgerEntry,
  type JsonObject,
  type JsonValue,
  type OutcomeClosure,
  type VerificationLevel,
} from "./canonical-artifact-engine";

export const ARTIFACT_PDF_ENGINE_VERSION = "1.0.0" as const;
export const ARTIFACT_PDF_PROFILE = "ta14.execution-artifact.pdf.v1" as const;
export const DEFAULT_PDF_FILENAME_PREFIX = "TA14-Execution-Artifact" as const;

export type PdfPageSizeName = "LETTER" | "A4" | "LEGAL";
export type PdfOrientation = "PORTRAIT" | "LANDSCAPE";
export type PdfColorMode = "FULL_COLOR" | "GRAYSCALE";
export type PdfDisclosureMode = "PUBLIC" | "SELECTIVE" | "INSTITUTIONAL";
export type PdfSectionId =
  | "COVER"
  | "EXECUTIVE_SUMMARY"
  | "CHAIN_OVERVIEW"
  | "SCENARIO"
  | "ROUTE"
  | "EVIDENCE"
  | "AUTHORITY"
  | "CONTINUITY"
  | "ADMISSIBILITY"
  | "BINDING"
  | "GATE_LEDGER"
  | "COMMIT"
  | "EXECUTION"
  | "OUTCOME"
  | "INTEGRITY"
  | "REVIEWS"
  | "CHALLENGES"
  | "PROOF_BOUNDARY"
  | "VERIFICATION"
  | "APPENDIX_JSON";

export interface ArtifactPdfOptions {
  pageSize: PdfPageSizeName;
  orientation: PdfOrientation;
  colorMode: PdfColorMode;
  disclosureMode: PdfDisclosureMode;
  includeTableOfContents: boolean;
  includeCanonicalJsonAppendix: boolean;
  includeEvidenceMetadata: boolean;
  includeCustodyEvents: boolean;
  includeAuthorityDelegations: boolean;
  includeReviews: boolean;
  includeChallenges: boolean;
  includeAmendments: boolean;
  includeComponentHashes: boolean;
  includeVerificationInstructions: boolean;
  includePageNumbers: boolean;
  includeWatermark: boolean;
  watermarkText: string;
  documentTitle: string | undefined;
  documentSubject: string | undefined;
  documentAuthor: string | undefined;
  documentKeywords: readonly string[];
  selectedSections: readonly PdfSectionId[] | undefined;
  maximumAppendixCharacters: number;
  generatedAt: string | undefined;
  verificationBaseUrl: string | undefined;
  institutionName: string;
  institutionUrl: string | undefined;
  footerNotice: string;
  locale: string;
}

export interface ArtifactPdfResult {
  bytes: Uint8Array;
  blob: Blob;
  filename: string;
  mimeType: "application/pdf";
  pageCount: number;
  byteLength: number;
  artifactId: string;
  determination: ArtifactDetermination;
  disclosureMode: PdfDisclosureMode;
  generatedAt: string;
  warnings: readonly string[];
}

export interface ArtifactPdfInspection {
  valid: boolean;
  errors: readonly string[];
  warnings: readonly string[];
  projectedSections: readonly PdfSectionId[];
  redactedEvidenceIds: readonly string[];
  omittedEvidenceIds: readonly string[];
  projectedPageCount: number;
}

export interface PdfPageDimensions {
  width: number;
  height: number;
}

export interface PdfMargins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface PdfRgb {
  r: number;
  g: number;
  b: number;
}

export interface PdfTheme {
  ink: PdfRgb;
  muted: PdfRgb;
  faint: PdfRgb;
  paper: PdfRgb;
  panel: PdfRgb;
  line: PdfRgb;
  gold: PdfRgb;
  blue: PdfRgb;
  green: PdfRgb;
  amber: PdfRgb;
  red: PdfRgb;
  purple: PdfRgb;
  white: PdfRgb;
  black: PdfRgb;
}

export interface PdfTextStyle {
  font: "REGULAR" | "BOLD" | "MONO" | "MONO_BOLD";
  size: number;
  color: PdfRgb;
  lineHeight: number;
  tracking: number;
  uppercase: boolean;
}

export interface PdfParagraphOptions {
  style?: Partial<PdfTextStyle>;
  before?: number;
  after?: number;
  indent?: number;
  keepTogether?: boolean;
  bullet?: string;
  maxLines?: number;
}

export interface PdfTableColumn<Row> {
  key: string;
  title: string;
  width: number;
  align?: "LEFT" | "CENTER" | "RIGHT";
  value: (row: Row) => string;
}

export interface PdfTableOptions<Row> {
  columns: readonly PdfTableColumn<Row>[];
  rows: readonly Row[];
  headerFill?: PdfRgb;
  zebra?: boolean;
  repeatHeader?: boolean;
  fontSize?: number;
  cellPadding?: number;
  minimumRowHeight?: number;
  emptyMessage?: string;
}

const PAGE_SIZES: Readonly<Record<PdfPageSizeName, PdfPageDimensions>> = {
  LETTER: { width: 612, height: 792 },
  A4: { width: 595.28, height: 841.89 },
  LEGAL: { width: 612, height: 1008 },
};

const DEFAULT_MARGINS: PdfMargins = {
  top: 54,
  right: 48,
  bottom: 54,
  left: 48,
};

const FULL_COLOR_THEME: PdfTheme = {
  ink: { r: 15, g: 29, b: 48 },
  muted: { r: 74, g: 91, b: 112 },
  faint: { r: 224, g: 231, b: 239 },
  paper: { r: 255, g: 255, b: 255 },
  panel: { r: 245, g: 248, b: 252 },
  line: { r: 194, g: 207, b: 222 },
  gold: { r: 201, g: 151, b: 57 },
  blue: { r: 32, g: 132, b: 220 },
  green: { r: 30, g: 146, b: 93 },
  amber: { r: 219, g: 145, b: 34 },
  red: { r: 201, g: 56, b: 64 },
  purple: { r: 121, g: 79, b: 180 },
  white: { r: 255, g: 255, b: 255 },
  black: { r: 0, g: 0, b: 0 },
};

const GRAYSCALE_THEME: PdfTheme = {
  ink: { r: 27, g: 27, b: 27 },
  muted: { r: 88, g: 88, b: 88 },
  faint: { r: 230, g: 230, b: 230 },
  paper: { r: 255, g: 255, b: 255 },
  panel: { r: 248, g: 248, b: 248 },
  line: { r: 205, g: 205, b: 205 },
  gold: { r: 155, g: 155, b: 155 },
  blue: { r: 112, g: 112, b: 112 },
  green: { r: 105, g: 105, b: 105 },
  amber: { r: 154, g: 154, b: 154 },
  red: { r: 100, g: 100, b: 100 },
  purple: { r: 103, g: 103, b: 103 },
  white: { r: 255, g: 255, b: 255 },
  black: { r: 0, g: 0, b: 0 },
};

export const DEFAULT_ARTIFACT_PDF_OPTIONS: ArtifactPdfOptions = {
  pageSize: "LETTER",
  orientation: "PORTRAIT",
  colorMode: "FULL_COLOR",
  disclosureMode: "PUBLIC",
  includeTableOfContents: true,
  includeCanonicalJsonAppendix: false,
  includeEvidenceMetadata: true,
  includeCustodyEvents: true,
  includeAuthorityDelegations: true,
  includeReviews: true,
  includeChallenges: true,
  includeAmendments: true,
  includeComponentHashes: true,
  includeVerificationInstructions: true,
  includePageNumbers: true,
  includeWatermark: false,
  watermarkText: "PUBLIC EXECUTION ARTIFACT",
  documentTitle: undefined,
  documentSubject: undefined,
  documentAuthor: "TA-14 Authority",
  documentKeywords: ["TA-14", "execution artifact", "admissible execution", "AI governance"],
  selectedSections: undefined,
  maximumAppendixCharacters: 120000,
  generatedAt: undefined,
  verificationBaseUrl: undefined,
  institutionName: "TA-14 Authority",
  institutionUrl: "https://ta14-exchange-platform-theta.vercel.app",
  footerNotice: "No admissible evidence. No admissible execution.",
  locale: "en-US",
};

const DEFAULT_SECTION_ORDER: readonly PdfSectionId[] = [
  "COVER",
  "EXECUTIVE_SUMMARY",
  "CHAIN_OVERVIEW",
  "SCENARIO",
  "ROUTE",
  "EVIDENCE",
  "AUTHORITY",
  "CONTINUITY",
  "ADMISSIBILITY",
  "BINDING",
  "GATE_LEDGER",
  "COMMIT",
  "EXECUTION",
  "OUTCOME",
  "INTEGRITY",
  "REVIEWS",
  "CHALLENGES",
  "PROOF_BOUNDARY",
  "VERIFICATION",
  "APPENDIX_JSON",
];

const SECTION_TITLES: Readonly<Record<PdfSectionId, string>> = {
  COVER: "Cover",
  EXECUTIVE_SUMMARY: "Executive Summary",
  CHAIN_OVERVIEW: "Chain Overview",
  SCENARIO: "Scenario",
  ROUTE: "Route",
  EVIDENCE: "Evidence",
  AUTHORITY: "Authority",
  CONTINUITY: "Continuity",
  ADMISSIBILITY: "Admissibility",
  BINDING: "Binding",
  GATE_LEDGER: "Gate Ledger",
  COMMIT: "Commit",
  EXECUTION: "Execution",
  OUTCOME: "Outcome",
  INTEGRITY: "Integrity",
  REVIEWS: "Reviews",
  CHALLENGES: "Challenges",
  PROOF_BOUNDARY: "Proof Boundary",
  VERIFICATION: "Verification",
  APPENDIX_JSON: "Appendix Json",
};

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

function normalizeOptions(options?: Partial<ArtifactPdfOptions>): ArtifactPdfOptions {
  return {
    ...DEFAULT_ARTIFACT_PDF_OPTIONS,
    ...options,
    documentKeywords: options?.documentKeywords ?? DEFAULT_ARTIFACT_PDF_OPTIONS.documentKeywords,
    selectedSections: options?.selectedSections ?? DEFAULT_ARTIFACT_PDF_OPTIONS.selectedSections,
  };
}

function resolvePageDimensions(options: ArtifactPdfOptions): PdfPageDimensions {
  const base = PAGE_SIZES[options.pageSize];
  if (options.orientation === "LANDSCAPE") {
    return { width: base.height, height: base.width };
  }
  return { ...base };
}

function rgb(color: PdfRgb): string {
  const r = (clamp(color.r, 0, 255) / 255).toFixed(4);
  const g = (clamp(color.g, 0, 255) / 255).toFixed(4);
  const b = (clamp(color.b, 0, 255) / 255).toFixed(4);
  return `${r} ${g} ${b}`;
}

function escapePdfText(value: string): string {
  return sanitizeText(value)
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)")
    .replace(/\r?\n/g, " ");
}

function sanitizeText(value: unknown): string {
  const input = value === null || value === undefined ? "" : String(value);
  return input
    .replace(/[\u2010-\u2015]/g, "-")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/\u2026/g, "...")
    .replace(/\u00a0/g, " ")
    .replace(/[^\x09\x0A\x0D\x20-\x7E\xA0-\xFF]/g, "?");
}

function safeFilenameSegment(value: string): string {
  const normalized = sanitizeText(value)
    .trim()
    .replace(/[^A-Za-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return normalized || "artifact";
}

function formatDateTime(value: string | undefined, locale: string): string {
  if (!value) return "Not recorded";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return sanitizeText(value);
  try {
    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    }).format(date);
  } catch {
    return date.toISOString();
  }
}

function stringifyJsonValue(value: JsonValue | unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (value === null || value === undefined) return "null";
  try {
    return canonicalStringify(value);
  } catch {
    return sanitizeText(value);
  }
}

function unique<T>(values: readonly T[]): T[] {
  return Array.from(new Set(values));
}

function splitWords(value: string): string[] {
  return sanitizeText(value)
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean);
}

function approximateTextWidth(value: string, size: number, font: PdfTextStyle["font"]): number {
  const factor = font === "MONO" || font === "MONO_BOLD" ? 0.6 : 0.51;
  return sanitizeText(value).length * size * factor;
}

function wrapText(value: string, maximumWidth: number, style: PdfTextStyle): string[] {
  const paragraphs = sanitizeText(value).split(/\n/);
  const lines: string[] = [];
  for (const paragraph of paragraphs) {
    const words = splitWords(paragraph);
    if (words.length === 0) {
      lines.push("");
      continue;
    }
    let current = "";
    for (const word of words) {
      const candidate = current ? `${current} ${word}` : word;
      if (approximateTextWidth(candidate, style.size, style.font) <= maximumWidth) {
        current = candidate;
        continue;
      }
      if (current) lines.push(current);
      if (approximateTextWidth(word, style.size, style.font) <= maximumWidth) {
        current = word;
        continue;
      }
      let fragment = "";
      for (const character of word) {
        const candidateFragment = fragment + character;
        if (approximateTextWidth(candidateFragment, style.size, style.font) > maximumWidth && fragment) {
          lines.push(fragment);
          fragment = character;
        } else {
          fragment = candidateFragment;
        }
      }
      current = fragment;
    }
    if (current) lines.push(current);
  }
  return lines;
}

function mergeTextStyle(base: PdfTextStyle, partial?: Partial<PdfTextStyle>): PdfTextStyle {
  return { ...base, ...(partial ?? {}) };
}

function actorLabel(actor: ActorReference | undefined): string {
  if (!actor) return "Not recorded";
  return [actor.displayName, actor.role, actor.organization].filter(Boolean).join(" | ");
}

function determinationColor(determination: ArtifactDetermination, theme: PdfTheme): PdfRgb {
  switch (determination) {
    case "ALLOW": return theme.green;
    case "HOLD": return theme.amber;
    case "DENY": return theme.red;
    case "ESCALATE": return theme.purple;
  }
}

function gateResultColor(result: ArtifactGateResult, theme: PdfTheme): PdfRgb {
  switch (result) {
    case "PASS": return theme.green;
    case "FAIL": return theme.red;
    case "UNRESOLVED": return theme.amber;
    case "NOT_APPLICABLE": return theme.muted;
  }
}

function disclosureAllowed(level: DisclosureLevel, mode: PdfDisclosureMode): boolean {
  if (mode === "INSTITUTIONAL") return true;
  if (mode === "SELECTIVE") return level !== "WITHHELD";
  return level === "PUBLIC";
}

function disclosureLabel(level: DisclosureLevel, mode: PdfDisclosureMode): string {
  return disclosureAllowed(level, mode) ? level : `${level} - REDACTED`;
}

function selectedSections(options: ArtifactPdfOptions): PdfSectionId[] {
  const requested = options.selectedSections ? unique(options.selectedSections) : [...DEFAULT_SECTION_ORDER];
  return requested.filter((section) => section !== "APPENDIX_JSON" || options.includeCanonicalJsonAppendix);
}

function estimateSectionPages(section: PdfSectionId, artifact: CanonicalExecutionArtifact): number {
  switch (section) {
    case "COVER": return 1;
    case "EXECUTIVE_SUMMARY": return 1;
    case "CHAIN_OVERVIEW": return 1;
    case "SCENARIO": return 1;
    case "ROUTE": return Math.max(1, Math.ceil(artifact.route.gateSequence.length / 12));
    case "EVIDENCE": return Math.max(1, Math.ceil(artifact.evidence.length / 4));
    case "AUTHORITY": return Math.max(1, Math.ceil(artifact.authorities.length / 3));
    case "CONTINUITY": return 1;
    case "ADMISSIBILITY": return Math.max(1, Math.ceil(artifact.admissibility.evidenceResults.length / 8));
    case "BINDING": return 1;
    case "GATE_LEDGER": return Math.max(1, Math.ceil(artifact.gateLedger.length / 10));
    case "COMMIT": return 1;
    case "EXECUTION": return Math.max(1, Math.ceil(artifact.executionReceipts.length / 3));
    case "OUTCOME": return 1;
    case "INTEGRITY": return 1;
    case "REVIEWS": return Math.max(1, Math.ceil(artifact.reviews.length / 5));
    case "CHALLENGES": return Math.max(1, Math.ceil(artifact.challenges.length / 5));
    case "PROOF_BOUNDARY": return 1;
    case "VERIFICATION": return 1;
    case "APPENDIX_JSON": return Math.max(1, Math.ceil(exportCanonicalJson(artifact, true).length / 4800));
  }
}

class PdfObjectStore {
  private readonly objects: Uint8Array[] = [];
  private readonly encoder = new TextEncoder();

  addTextObject(body: string): number {
    return this.addBytesObject(this.encoder.encode(body));
  }

  addBytesObject(body: Uint8Array): number {
    this.objects.push(body);
    return this.objects.length;
  }

  replaceTextObject(reference: number, body: string): void {
    this.objects[reference - 1] = this.encoder.encode(body);
  }

  addStream(dictionary: string, stream: string): number {
    const streamBytes = this.encoder.encode(stream);
    const prefix = this.encoder.encode(`<< ${dictionary} /Length ${streamBytes.length} >>\nstream\n`);
    const suffix = this.encoder.encode("\nendstream");
    return this.addBytesObject(concatBytes([prefix, streamBytes, suffix]));
  }

  build(rootReference: number, infoReference: number): Uint8Array {
    const header = this.encoder.encode("%PDF-1.7\n%TA14\n");
    const parts: Uint8Array[] = [header];
    const offsets: number[] = [0];
    let offset = header.length;

    this.objects.forEach((body, index) => {
      offsets.push(offset);
      const prefix = this.encoder.encode(`${index + 1} 0 obj\n`);
      const suffix = this.encoder.encode("\nendobj\n");
      const objectBytes = concatBytes([prefix, body, suffix]);
      parts.push(objectBytes);
      offset += objectBytes.length;
    });

    const xrefOffset = offset;
    const xrefLines = ["xref", `0 ${this.objects.length + 1}`, "0000000000 65535 f "];
    for (let index = 1; index <= this.objects.length; index += 1) {
      xrefLines.push(`${String(offsets[index]).padStart(10, "0")} 00000 n `);
    }
    const trailer = [
      ...xrefLines,
      "trailer",
      `<< /Size ${this.objects.length + 1} /Root ${rootReference} 0 R /Info ${infoReference} 0 R >>`,
      "startxref",
      String(xrefOffset),
      "%%EOF",
      "",
    ].join("\n");
    parts.push(this.encoder.encode(trailer));
    return concatBytes(parts);
  }
}

function concatBytes(parts: readonly Uint8Array[]): Uint8Array {
  const total = parts.reduce((sum, part) => sum + part.length, 0);
  const output = new Uint8Array(total);
  let cursor = 0;
  for (const part of parts) {
    output.set(part, cursor);
    cursor += part.length;
  }
  return output;
}

class PdfContentStream {
  private readonly commands: string[] = [];

  raw(command: string): void {
    this.commands.push(command);
  }

  save(): void {
    this.raw("q");
  }

  restore(): void {
    this.raw("Q");
  }

  setFill(color: PdfRgb): void {
    this.raw(`${rgb(color)} rg`);
  }

  setStroke(color: PdfRgb): void {
    this.raw(`${rgb(color)} RG`);
  }

  setLineWidth(width: number): void {
    this.raw(`${width.toFixed(3)} w`);
  }

  rectangle(x: number, y: number, width: number, height: number): void {
    this.raw(`${x.toFixed(3)} ${y.toFixed(3)} ${width.toFixed(3)} ${height.toFixed(3)} re`);
  }

  fill(): void {
    this.raw("f");
  }

  stroke(): void {
    this.raw("S");
  }

  fillAndStroke(): void {
    this.raw("B");
  }

  line(x1: number, y1: number, x2: number, y2: number): void {
    this.raw(`${x1.toFixed(3)} ${y1.toFixed(3)} m ${x2.toFixed(3)} ${y2.toFixed(3)} l S`);
  }

  text(
    x: number,
    y: number,
    value: string,
    style: PdfTextStyle,
    fontResource: string,
  ): void {
    const display = style.uppercase ? value.toUpperCase() : value;
    this.setFill(style.color);
    this.raw("BT");
    this.raw(`/${fontResource} ${style.size.toFixed(3)} Tf`);
    if (style.tracking !== 0) this.raw(`${style.tracking.toFixed(3)} Tc`);
    this.raw(`${x.toFixed(3)} ${y.toFixed(3)} Td`);
    this.raw(`(${escapePdfText(display)}) Tj`);
    this.raw("ET");
  }

  toString(): string {
    return this.commands.join("\n");
  }
}

interface PdfPageRecord {
  stream: PdfContentStream;
  contentReference?: number;
  pageReference?: number;
}

class ArtifactPdfDocument {
  readonly dimensions: PdfPageDimensions;
  readonly margins: PdfMargins;
  readonly theme: PdfTheme;
  readonly options: ArtifactPdfOptions;
  readonly warnings: string[] = [];

  private readonly pages: PdfPageRecord[] = [];
  private currentPageIndex = -1;
  private cursorY = 0;
  private sectionTitle = "";
  private readonly store = new PdfObjectStore();
  private readonly fontReferences: Record<PdfTextStyle["font"], number>;
  private readonly fontResources: Record<PdfTextStyle["font"], string> = {
    REGULAR: "F1",
    BOLD: "F2",
    MONO: "F3",
    MONO_BOLD: "F4",
  };

  constructor(options: ArtifactPdfOptions) {
    this.options = options;
    this.dimensions = resolvePageDimensions(options);
    this.margins = { ...DEFAULT_MARGINS };
    this.theme = options.colorMode === "GRAYSCALE" ? GRAYSCALE_THEME : FULL_COLOR_THEME;
    this.fontReferences = {
      REGULAR: this.store.addTextObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>"),
      BOLD: this.store.addTextObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>"),
      MONO: this.store.addTextObject("<< /Type /Font /Subtype /Type1 /BaseFont /Courier /Encoding /WinAnsiEncoding >>"),
      MONO_BOLD: this.store.addTextObject("<< /Type /Font /Subtype /Type1 /BaseFont /Courier-Bold /Encoding /WinAnsiEncoding >>"),
    };
  }

  get pageCount(): number {
    return this.pages.length;
  }

  get contentWidth(): number {
    return this.dimensions.width - this.margins.left - this.margins.right;
  }

  get contentHeight(): number {
    return this.dimensions.height - this.margins.top - this.margins.bottom;
  }

  get y(): number {
    return this.cursorY;
  }

  set y(value: number) {
    this.cursorY = value;
  }

  private get page(): PdfPageRecord {
    if (this.currentPageIndex < 0) this.addPage();
    return this.pages[this.currentPageIndex];
  }

  addPage(sectionTitle = this.sectionTitle): void {
    this.sectionTitle = sectionTitle;
    this.pages.push({ stream: new PdfContentStream() });
    this.currentPageIndex = this.pages.length - 1;
    this.cursorY = this.dimensions.height - this.margins.top;
    this.drawPageBackground();
    this.drawRunningHeader();
  }

  setSection(title: string): void {
    this.sectionTitle = title;
  }

  ensureSpace(requiredHeight: number): void {
    const bottomBoundary = this.margins.bottom + 28;
    if (this.cursorY - requiredHeight < bottomBoundary) {
      this.addPage(this.sectionTitle);
    }
  }

  moveDown(distance: number): void {
    this.cursorY -= distance;
  }

  drawPageBackground(): void {
    this.page.stream.setFill(this.theme.paper);
    this.page.stream.rectangle(0, 0, this.dimensions.width, this.dimensions.height);
    this.page.stream.fill();
  }

  drawRunningHeader(): void {
    if (this.pages.length === 1) return;
    const headerStyle = this.style("CAPTION");
    this.page.stream.text(
      this.margins.left,
      this.dimensions.height - 28,
      this.options.institutionName,
      headerStyle,
      this.fontResources[headerStyle.font],
    );
    const right = this.sectionTitle || "Execution Artifact";
    const width = approximateTextWidth(right, headerStyle.size, headerStyle.font);
    this.page.stream.text(
      this.dimensions.width - this.margins.right - width,
      this.dimensions.height - 28,
      right,
      headerStyle,
      this.fontResources[headerStyle.font],
    );
    this.page.stream.setStroke(this.theme.line);
    this.page.stream.setLineWidth(0.5);
    this.page.stream.line(
      this.margins.left,
      this.dimensions.height - 36,
      this.dimensions.width - this.margins.right,
      this.dimensions.height - 36,
    );
  }

  drawPageFooters(): void {
    this.pages.forEach((page, index) => {
      const style = this.style("FOOTER");
      page.stream.setStroke(this.theme.line);
      page.stream.setLineWidth(0.5);
      page.stream.line(
        this.margins.left,
        36,
        this.dimensions.width - this.margins.right,
        36,
      );
      page.stream.text(
        this.margins.left,
        20,
        this.options.footerNotice,
        style,
        this.fontResources[style.font],
      );
      if (this.options.includePageNumbers) {
        const label = `Page ${index + 1} of ${this.pages.length}`;
        const width = approximateTextWidth(label, style.size, style.font);
        page.stream.text(
          this.dimensions.width - this.margins.right - width,
          20,
          label,
          style,
          this.fontResources[style.font],
        );
      }
      if (this.options.includeWatermark && this.options.watermarkText) {
        const watermark: PdfTextStyle = {
          font: "BOLD",
          size: 38,
          color: this.theme.faint,
          lineHeight: 42,
          tracking: 1.5,
          uppercase: true,
        };
        const text = this.options.watermarkText;
        const width = approximateTextWidth(text, watermark.size, watermark.font);
        page.stream.save();
        page.stream.raw(`0.7071 0.7071 -0.7071 0.7071 ${this.dimensions.width / 2} ${this.dimensions.height / 2} cm`);
        page.stream.text(-width / 2, 0, text, watermark, this.fontResources[watermark.font]);
        page.stream.restore();
      }
    });
  }

  style(name: "TITLE" | "SUBTITLE" | "H1" | "H2" | "H3" | "BODY" | "SMALL" | "CAPTION" | "FOOTER" | "MONO"): PdfTextStyle {
    switch (name) {
      case "TITLE": return { font: "BOLD", size: 25, color: this.theme.ink, lineHeight: 30, tracking: 0.1, uppercase: false };
      case "SUBTITLE": return { font: "REGULAR", size: 12, color: this.theme.muted, lineHeight: 17, tracking: 0, uppercase: false };
      case "H1": return { font: "BOLD", size: 18, color: this.theme.ink, lineHeight: 23, tracking: 0, uppercase: false };
      case "H2": return { font: "BOLD", size: 13, color: this.theme.blue, lineHeight: 17, tracking: 0, uppercase: false };
      case "H3": return { font: "BOLD", size: 10, color: this.theme.ink, lineHeight: 14, tracking: 0.15, uppercase: true };
      case "BODY": return { font: "REGULAR", size: 9.3, color: this.theme.ink, lineHeight: 13.2, tracking: 0, uppercase: false };
      case "SMALL": return { font: "REGULAR", size: 7.8, color: this.theme.muted, lineHeight: 10.5, tracking: 0, uppercase: false };
      case "CAPTION": return { font: "BOLD", size: 7, color: this.theme.muted, lineHeight: 9, tracking: 0.25, uppercase: true };
      case "FOOTER": return { font: "REGULAR", size: 6.8, color: this.theme.muted, lineHeight: 8, tracking: 0, uppercase: false };
      case "MONO": return { font: "MONO", size: 7.1, color: this.theme.ink, lineHeight: 9.4, tracking: 0, uppercase: false };
    }
  }

  textLine(value: string, x: number, y: number, style: PdfTextStyle): void {
    this.page.stream.text(x, y, value, style, this.fontResources[style.font]);
  }

  paragraph(value: string, options: PdfParagraphOptions = {}): void {
    const base = this.style("BODY");
    const style = mergeTextStyle(base, options.style);
    const before = options.before ?? 0;
    const after = options.after ?? 7;
    const indent = options.indent ?? 0;
    const bullet = options.bullet;
    this.moveDown(before);
    const bulletWidth = bullet ? 14 : 0;
    const available = this.contentWidth - indent - bulletWidth;
    let lines = wrapText(value, available, style);
    if (options.maxLines && lines.length > options.maxLines) {
      lines = lines.slice(0, options.maxLines);
      const finalIndex = lines.length - 1;
      lines[finalIndex] = `${lines[finalIndex].replace(/\.*$/, "")}...`;
    }
    const height = Math.max(style.lineHeight, lines.length * style.lineHeight) + before + after;
    if (options.keepTogether) this.ensureSpace(height);
    lines.forEach((line, index) => {
      this.ensureSpace(style.lineHeight + after);
      const y = this.cursorY - style.size;
      if (bullet && index === 0) {
        this.textLine(bullet, this.margins.left + indent, y, style);
      }
      this.textLine(line, this.margins.left + indent + bulletWidth, y, style);
      this.moveDown(style.lineHeight);
    });
    this.moveDown(after);
  }

  heading(value: string, level: 1 | 2 | 3 = 1): void {
    const style = this.style(level === 1 ? "H1" : level === 2 ? "H2" : "H3");
    const before = level === 1 ? 10 : level === 2 ? 8 : 6;
    const after = level === 1 ? 8 : 5;
    this.ensureSpace(before + style.lineHeight + after);
    this.moveDown(before);
    this.textLine(value, this.margins.left, this.cursorY - style.size, style);
    this.moveDown(style.lineHeight + after);
    if (level === 1) {
      this.page.stream.setStroke(this.theme.gold);
      this.page.stream.setLineWidth(1.4);
      this.page.stream.line(this.margins.left, this.cursorY + 2, this.margins.left + 72, this.cursorY + 2);
      this.moveDown(3);
    }
  }

  labelValue(label: string, value: string, options: { labelWidth?: number; color?: PdfRgb } = {}): void {
    const labelWidth = options.labelWidth ?? 128;
    const labelStyle = this.style("H3");
    const valueStyle = this.style("BODY");
    const lines = wrapText(value, this.contentWidth - labelWidth - 10, valueStyle);
    const rowHeight = Math.max(labelStyle.lineHeight, lines.length * valueStyle.lineHeight) + 7;
    this.ensureSpace(rowHeight);
    this.textLine(label, this.margins.left, this.cursorY - labelStyle.size, { ...labelStyle, color: options.color ?? labelStyle.color });
    lines.forEach((line, index) => {
      this.textLine(line, this.margins.left + labelWidth, this.cursorY - valueStyle.size - index * valueStyle.lineHeight, valueStyle);
    });
    this.moveDown(rowHeight);
  }

  callout(title: string, body: string, tone: "INFO" | "SUCCESS" | "WARNING" | "DANGER" = "INFO"): void {
    const titleStyle = this.style("H3");
    const bodyStyle = this.style("BODY");
    const color = tone === "SUCCESS" ? this.theme.green : tone === "WARNING" ? this.theme.amber : tone === "DANGER" ? this.theme.red : this.theme.blue;
    const lines = wrapText(body, this.contentWidth - 28, bodyStyle);
    const height = 26 + lines.length * bodyStyle.lineHeight + 12;
    this.ensureSpace(height + 8);
    const bottom = this.cursorY - height;
    this.page.stream.setFill(this.theme.panel);
    this.page.stream.setStroke(color);
    this.page.stream.setLineWidth(1);
    this.page.stream.rectangle(this.margins.left, bottom, this.contentWidth, height);
    this.page.stream.fillAndStroke();
    this.textLine(title, this.margins.left + 14, this.cursorY - 18, { ...titleStyle, color });
    lines.forEach((line, index) => {
      this.textLine(line, this.margins.left + 14, this.cursorY - 36 - index * bodyStyle.lineHeight, bodyStyle);
    });
    this.cursorY = bottom - 9;
  }

  badge(label: string, color: PdfRgb, x: number, y: number, width?: number): number {
    const style: PdfTextStyle = { font: "BOLD", size: 8, color: this.theme.white, lineHeight: 10, tracking: 0.3, uppercase: true };
    const resolvedWidth = width ?? Math.max(54, approximateTextWidth(label.toUpperCase(), style.size, style.font) + 18);
    this.page.stream.setFill(color);
    this.page.stream.rectangle(x, y - 2, resolvedWidth, 18);
    this.page.stream.fill();
    this.textLine(label, x + 9, y + 3, style);
    return resolvedWidth;
  }

  keyValueGrid(items: readonly { label: string; value: string; tone?: PdfRgb }[], columns = 2): void {
    const gap = 10;
    const width = (this.contentWidth - gap * (columns - 1)) / columns;
    const body = this.style("BODY");
    const label = this.style("CAPTION");
    for (let index = 0; index < items.length; index += columns) {
      const row = items.slice(index, index + columns);
      const heights = row.map((item) => {
        const lines = wrapText(item.value, width - 20, body);
        return 32 + lines.length * body.lineHeight;
      });
      const height = Math.max(...heights, 46);
      this.ensureSpace(height + 10);
      row.forEach((item, columnIndex) => {
        const x = this.margins.left + columnIndex * (width + gap);
        const bottom = this.cursorY - height;
        this.page.stream.setFill(this.theme.panel);
        this.page.stream.setStroke(item.tone ?? this.theme.line);
        this.page.stream.setLineWidth(0.8);
        this.page.stream.rectangle(x, bottom, width, height);
        this.page.stream.fillAndStroke();
        this.textLine(item.label, x + 10, this.cursorY - 17, { ...label, color: item.tone ?? label.color });
        const lines = wrapText(item.value, width - 20, body);
        lines.forEach((line, lineIndex) => {
          this.textLine(line, x + 10, this.cursorY - 35 - lineIndex * body.lineHeight, body);
        });
      });
      this.moveDown(height + 10);
    }
  }

  table<Row>(options: PdfTableOptions<Row>): void {
    const fontSize = options.fontSize ?? 7.6;
    const padding = options.cellPadding ?? 5;
    const minimumRowHeight = options.minimumRowHeight ?? 22;
    const totalWidth = options.columns.reduce((sum, column) => sum + column.width, 0);
    const scale = totalWidth > this.contentWidth ? this.contentWidth / totalWidth : 1;
    const columns = options.columns.map((column) => ({ ...column, width: column.width * scale }));
    const headerStyle: PdfTextStyle = { font: "BOLD", size: fontSize, color: this.theme.white, lineHeight: fontSize + 2.4, tracking: 0, uppercase: false };
    const bodyStyle: PdfTextStyle = { font: "REGULAR", size: fontSize, color: this.theme.ink, lineHeight: fontSize + 2.8, tracking: 0, uppercase: false };

    const drawHeader = (): void => {
      const linesByColumn = columns.map((column) => wrapText(column.title, column.width - padding * 2, headerStyle));
      const height = Math.max(minimumRowHeight, ...linesByColumn.map((lines) => lines.length * headerStyle.lineHeight + padding * 2));
      this.ensureSpace(height + minimumRowHeight);
      let x = this.margins.left;
      columns.forEach((column, index) => {
        this.page.stream.setFill(options.headerFill ?? this.theme.ink);
        this.page.stream.rectangle(x, this.cursorY - height, column.width, height);
        this.page.stream.fill();
        linesByColumn[index].forEach((line, lineIndex) => {
          this.textLine(line, x + padding, this.cursorY - padding - headerStyle.size - lineIndex * headerStyle.lineHeight, headerStyle);
        });
        x += column.width;
      });
      this.moveDown(height);
    };

    drawHeader();
    if (options.rows.length === 0) {
      this.paragraph(options.emptyMessage ?? "No records were preserved for this section.", { style: { color: this.theme.muted }, after: 8 });
      return;
    }

    options.rows.forEach((row, rowIndex) => {
      const values = columns.map((column) => column.value(row));
      const wrapped = values.map((value, index) => wrapText(value, columns[index].width - padding * 2, bodyStyle));
      const height = Math.max(minimumRowHeight, ...wrapped.map((lines) => lines.length * bodyStyle.lineHeight + padding * 2));
      if (this.cursorY - height < this.margins.bottom + 36) {
        this.addPage(this.sectionTitle);
        if (options.repeatHeader !== false) drawHeader();
      }
      let x = this.margins.left;
      columns.forEach((column, columnIndex) => {
        if (options.zebra !== false && rowIndex % 2 === 1) {
          this.page.stream.setFill(this.theme.panel);
          this.page.stream.rectangle(x, this.cursorY - height, column.width, height);
          this.page.stream.fill();
        }
        this.page.stream.setStroke(this.theme.line);
        this.page.stream.setLineWidth(0.4);
        this.page.stream.rectangle(x, this.cursorY - height, column.width, height);
        this.page.stream.stroke();
        wrapped[columnIndex].forEach((line, lineIndex) => {
          const lineWidth = approximateTextWidth(line, bodyStyle.size, bodyStyle.font);
          const align = column.align ?? "LEFT";
          const tx = align === "CENTER" ? x + (column.width - lineWidth) / 2 : align === "RIGHT" ? x + column.width - padding - lineWidth : x + padding;
          this.textLine(line, tx, this.cursorY - padding - bodyStyle.size - lineIndex * bodyStyle.lineHeight, bodyStyle);
        });
        x += column.width;
      });
      this.moveDown(height);
    });
    this.moveDown(9);
  }

  sectionBreak(): void {
    this.ensureSpace(18);
    this.page.stream.setStroke(this.theme.line);
    this.page.stream.setLineWidth(0.6);
    this.page.stream.line(this.margins.left, this.cursorY, this.dimensions.width - this.margins.right, this.cursorY);
    this.moveDown(14);
  }

  build(metadata: { title: string; subject: string; author: string; keywords: readonly string[]; createdAt: string }): Uint8Array {
    this.drawPageFooters();
    const pagesReference = this.store.addTextObject("<< /Type /Pages /Kids [] /Count 0 >>");
    this.pages.forEach((page) => {
      page.contentReference = this.store.addStream("", page.stream.toString());
      const resources = `<< /Font << /F1 ${this.fontReferences.REGULAR} 0 R /F2 ${this.fontReferences.BOLD} 0 R /F3 ${this.fontReferences.MONO} 0 R /F4 ${this.fontReferences.MONO_BOLD} 0 R >> >>`;
      page.pageReference = this.store.addTextObject(
        `<< /Type /Page /Parent ${pagesReference} 0 R /MediaBox [0 0 ${this.dimensions.width.toFixed(3)} ${this.dimensions.height.toFixed(3)}] /Resources ${resources} /Contents ${page.contentReference} 0 R >>`,
      );
    });
    const kids = this.pages.map((page) => `${page.pageReference} 0 R`).join(" ");
    this.store.replaceTextObject(pagesReference, `<< /Type /Pages /Kids [${kids}] /Count ${this.pages.length} >>`);
    const catalogReference = this.store.addTextObject(`<< /Type /Catalog /Pages ${pagesReference} 0 R /PageMode /UseOutlines >>`);
    const creationDate = pdfDate(metadata.createdAt);
    const keywords = metadata.keywords.join(", ");
    const infoReference = this.store.addTextObject(
      `<< /Title (${escapePdfText(metadata.title)}) /Subject (${escapePdfText(metadata.subject)}) /Author (${escapePdfText(metadata.author)}) /Creator (TA-14 Artifact PDF Engine ${ARTIFACT_PDF_ENGINE_VERSION}) /Producer (TA-14 Authority) /Keywords (${escapePdfText(keywords)}) /CreationDate (${creationDate}) /ModDate (${creationDate}) >>`,
    );
    return this.store.build(catalogReference, infoReference);
  }
}

function pdfDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "D:19700101000000Z";
  const pad = (number: number): string => String(number).padStart(2, "0");
  return `D:${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`;
}

function renderCover(document: ArtifactPdfDocument, artifact: CanonicalExecutionArtifact, options: ArtifactPdfOptions): void {
  document.setSection("Cover");
  document.addPage("Cover");
  const theme = document.theme;
  const top = document.dimensions.height - 76;
  document.textLine(options.institutionName.toUpperCase(), document.margins.left, top, { ...document.style("CAPTION"), color: theme.gold, size: 9 });
  document.textLine("EXECUTION ARTIFACT", document.margins.left, top - 24, { ...document.style("H3"), color: theme.blue, size: 11 });
  const titleStyle = document.style("TITLE");
  const titleLines = wrapText(artifact.identity.title, document.contentWidth - 20, titleStyle);
  titleLines.forEach((line, index) => {
    document.textLine(line, document.margins.left, top - 72 - index * titleStyle.lineHeight, titleStyle);
  });
  const titleBottom = top - 72 - titleLines.length * titleStyle.lineHeight;
  const determination = artifact.commit.determination;
  document.badge(determination, determinationColor(determination, theme), document.margins.left, titleBottom - 12, 92);
  document.textLine(artifact.identity.artifactId, document.margins.left + 110, titleBottom - 7, { ...document.style("MONO"), size: 9, color: theme.muted });

  const panelTop = titleBottom - 62;
  const panelHeight = 228;
  document.y = panelTop;
  document.keyValueGrid([
    { label: "SERIES", value: artifact.identity.seriesId },
    { label: "SEQUENCE", value: String(artifact.identity.sequence) },
    { label: "CLASSIFICATION", value: artifact.identity.classification },
    { label: "SECTOR", value: artifact.identity.sector },
    { label: "JURISDICTION", value: artifact.identity.jurisdiction },
    { label: "PUBLICATION STATE", value: artifact.identity.publicationState },
    { label: "ROUTE", value: `${artifact.route.routeId} v${artifact.route.routeVersion}` },
    { label: "VERIFICATION LEVEL", value: String(artifact.integrity?.verificationLevel ?? 0) },
  ], 2);
  document.y = Math.min(document.y, panelTop - panelHeight);
  document.callout(
    "GOVERNING PRINCIPLE",
    "No admissible evidence. No admissible execution.",
    determination === "ALLOW" ? "SUCCESS" : determination === "DENY" ? "DANGER" : "WARNING",
  );
  document.paragraph(
    "This PDF is a human-readable projection of a bounded canonical execution artifact. The canonical JSON record and integrity manifest remain authoritative for machine verification.",
    { style: { color: theme.muted, size: 8.4 }, before: 8, after: 4 },
  );
  if (options.verificationBaseUrl) {
    document.labelValue("Verify online", `${options.verificationBaseUrl.replace(/\/$/, "")}/${artifact.identity.slug}`);
  }
}

function renderTableOfContents(document: ArtifactPdfDocument, sections: readonly PdfSectionId[], artifact: CanonicalExecutionArtifact): void {
  document.setSection("Table of Contents");
  document.addPage("Table of Contents");
  document.heading("Table of Contents", 1);
  let projectedPage = 1;
  const rows = sections.map((section, index) => {
    const start = projectedPage;
    projectedPage += estimateSectionPages(section, artifact);
    return { number: index + 1, title: SECTION_TITLES[section], page: start };
  });
  document.table({
    columns: [
      { key: "number", title: "#", width: 36, align: "CENTER", value: (row) => String(row.number).padStart(2, "0") },
      { key: "title", title: "Section", width: 390, value: (row) => row.title },
      { key: "page", title: "Projected page", width: 90, align: "RIGHT", value: (row) => String(row.page) },
    ],
    rows,
    headerFill: document.theme.ink,
    zebra: true,
  });
  document.callout("NAVIGATION NOTE", "PDF page projections are informational. Actual page numbers depend on record density and disclosure mode.", "INFO");
}

function renderExecutiveSummary(document: ArtifactPdfDocument, artifact: CanonicalExecutionArtifact): void {
  document.setSection("Executive Summary");
  document.addPage("Executive Summary");
  document.heading("Executive Summary", 1);
  document.keyValueGrid([
    { label: "DETERMINATION", value: artifact.commit.determination, tone: determinationColor(artifact.commit.determination, document.theme) },
    { label: "EXECUTION EFFECT", value: unique(artifact.executionReceipts.map((receipt) => receipt.effect)).join(", ") || "No receipt" },
    { label: "EARLIEST FAILURE", value: artifact.commit.earliestFailureChainLink ?? "None - route satisfied" },
    { label: "OUTCOME STATE", value: artifact.outcome?.consequenceState ?? "Not closed" },
  ], 2);
  document.heading("What was proposed", 2);
  document.paragraph(artifact.scenario.proposedAction);
  document.heading("Consequence at stake", 2);
  document.paragraph(artifact.scenario.consequenceAtStake);
  document.heading("Committed determination", 2);
  document.paragraph(artifact.commit.explanation);
  document.heading("Observed outcome", 2);
  document.paragraph(artifact.outcome?.actualOutcome ?? "Outcome closure has not been preserved.");
  document.heading("Proof boundary", 2);
  artifact.proofBoundary.proves.forEach((item) => document.paragraph(item, { bullet: "-", indent: 6, after: 2 }));
}

function renderChainOverview(document: ArtifactPdfDocument, artifact: CanonicalExecutionArtifact): void {
  document.setSection("Chain Overview");
  document.addPage("Chain Overview");
  document.heading("Reality to Outcome", 1);
  document.paragraph("The eight visible anchors preserve the minimum public explanation of how a consequential action moved, or failed to move, from reality into outcome.");
  const grouped = new Map<ChainLink, GateLedgerEntry[]>();
  CHAIN_LINKS.forEach((link) => grouped.set(link, []));
  artifact.gateLedger.forEach((entry) => grouped.get(entry.chainLink)?.push(entry));
  CHAIN_LINKS.forEach((link, index) => {
    const entries = grouped.get(link) ?? [];
    const failed = entries.some((entry) => entry.result === "FAIL");
    const unresolved = entries.some((entry) => entry.result === "UNRESOLVED");
    const tone = failed ? document.theme.red : unresolved ? document.theme.amber : document.theme.green;
    document.ensureSpace(62);
    document.badge(String(index + 1).padStart(2, "0"), tone, document.margins.left, document.y - 14, 34);
    document.textLine(link, document.margins.left + 46, document.y - 9, { ...document.style("H2"), color: tone });
    document.moveDown(22);
    document.paragraph(`${entries.length} runtime gate${entries.length === 1 ? "" : "s"}; ${entries.filter((entry) => entry.result === "PASS").length} passed; ${entries.filter((entry) => entry.result === "FAIL").length} failed; ${entries.filter((entry) => entry.result === "UNRESOLVED").length} unresolved.`, { indent: 46, after: 6, style: { size: 8.4 } });
  });
}

function renderScenario(document: ArtifactPdfDocument, artifact: CanonicalExecutionArtifact): void {
  document.setSection("Scenario");
  document.addPage("Scenario");
  document.heading("Bounded Scenario", 1);
  document.labelValue("Scenario ID", artifact.scenario.scenarioId);
  document.labelValue("Requested at", formatDateTime(artifact.scenario.requestedAt, document.options.locale));
  document.labelValue("Environment", artifact.scenario.environment);
  document.labelValue("Destination", artifact.scenario.intendedDestination ?? "Not specified");
  document.labelValue("Amount / quantity", artifact.scenario.amountOrQuantity ?? "Not specified");
  document.labelValue("Requested model", artifact.scenario.requestedModel ?? "Not specified");
  document.labelValue("Requested tool", artifact.scenario.requestedTool ?? "Not specified");
  document.heading("Proposed action", 2);
  document.paragraph(artifact.scenario.proposedAction);
  document.heading("Consequence at stake", 2);
  document.paragraph(artifact.scenario.consequenceAtStake);
  document.heading("Affected subjects", 2);
  artifact.scenario.affectedSubjects.forEach((item) => document.paragraph(item, { bullet: "-", indent: 8, after: 2 }));
  document.heading("Assumptions", 2);
  artifact.scenario.assumptions.forEach((item) => document.paragraph(item, { bullet: "-", indent: 8, after: 2 }));
  document.heading("Declared limits", 2);
  artifact.scenario.declaredLimits.forEach((item) => document.paragraph(item, { bullet: "-", indent: 8, after: 2 }));
}

function renderRoute(document: ArtifactPdfDocument, artifact: CanonicalExecutionArtifact): void {
  document.setSection("Route");
  document.addPage("Route");
  document.heading("Frozen Governing Route", 1);
  document.keyValueGrid([
    { label: "ROUTE ID", value: artifact.route.routeId },
    { label: "VERSION", value: artifact.route.routeVersion },
    { label: "TITLE", value: artifact.route.routeTitle },
    { label: "FROZEN AT", value: formatDateTime(artifact.route.frozenAt, document.options.locale) },
    { label: "OWNER", value: actorLabel(artifact.route.routeOwner) },
    { label: "JURISDICTION PROFILE", value: artifact.route.jurisdictionProfile },
  ], 2);
  document.heading("Policy basis", 2);
  document.table({
    columns: [
      { key: "id", title: "Policy", width: 100, value: (row) => row.policyId },
      { key: "title", title: "Title", width: 140, value: (row) => row.title },
      { key: "version", title: "Version", width: 60, value: (row) => row.version },
      { key: "effect", title: "Binding effect", width: 210, value: (row) => row.bindingEffect },
    ],
    rows: artifact.route.policyBasis,
    repeatHeader: true,
  });
  document.heading("Permitted execution surface", 2);
  document.labelValue("Models", artifact.route.permittedModels.join(", ") || "None");
  document.labelValue("Tools", artifact.route.permittedTools.join(", ") || "None");
  document.labelValue("Destinations", artifact.route.permittedDestinations.join(", ") || "None");
  document.heading("Revalidation triggers", 2);
  document.table({
    columns: [
      { key: "id", title: "Trigger", width: 88, value: (row) => row.triggerId },
      { key: "path", title: "Field", width: 130, value: (row) => row.fieldPath },
      { key: "description", title: "Description", width: 220, value: (row) => row.description },
      { key: "response", title: "Response", width: 78, align: "CENTER", value: (row) => row.requiredResponse },
    ],
    rows: artifact.route.revalidationTriggers,
  });
}

function evidenceDisplayValue(evidence: EvidenceItem, mode: PdfDisclosureMode): string {
  if (disclosureAllowed(evidence.disclosureLevel, mode)) return evidence.description;
  return `[REDACTED: ${evidence.disclosureLevel} evidence retained in governed package]`;
}

function renderEvidence(document: ArtifactPdfDocument, artifact: CanonicalExecutionArtifact): void {
  document.setSection("Evidence");
  document.addPage("Evidence");
  document.heading("Evidence Record", 1);
  document.paragraph(`Disclosure mode: ${document.options.disclosureMode}. Evidence content that exceeds this disclosure lane remains represented by identity, state, custody, and integrity metadata.`);
  artifact.evidence.forEach((evidence, index) => {
    document.ensureSpace(150);
    document.heading(`${String(index + 1).padStart(2, "0")} - ${evidence.title}`, 2);
    document.keyValueGrid([
      { label: "EVIDENCE ID", value: evidence.evidenceId },
      { label: "STATE", value: evidence.admissibility },
      { label: "SOURCE", value: `${evidence.sourceType} | ${evidence.sourceName}` },
      { label: "DISCLOSURE", value: disclosureLabel(evidence.disclosureLevel, document.options.disclosureMode) },
      { label: "CAPTURED", value: formatDateTime(evidence.capturedAt, document.options.locale) },
      { label: "FRESHNESS", value: evidence.freshness },
    ], 2);
    document.paragraph(evidenceDisplayValue(evidence, document.options.disclosureMode));
    if (document.options.includeEvidenceMetadata) {
      document.labelValue("Content hash", evidence.contentHash ?? "Not recorded");
      document.labelValue("Supports claims", evidence.supportsClaims.join("; ") || "None declared");
      document.labelValue("Contradicts claims", evidence.contradictsClaims.join("; ") || "None declared");
      document.labelValue("Limitations", evidence.limitations.join("; ") || "None declared");
    }
    if (document.options.includeCustodyEvents && evidence.custody.length > 0) {
      document.heading("Custody events", 3);
      document.table({
        columns: [
          { key: "time", title: "Occurred", width: 110, value: (row) => formatDateTime(row.occurredAt, document.options.locale) },
          { key: "action", title: "Action", width: 72, value: (row) => row.action },
          { key: "actor", title: "Actor", width: 140, value: (row) => actorLabel(row.actor) },
          { key: "note", title: "Note", width: 190, value: (row) => row.note ?? "" },
        ],
        rows: evidence.custody,
        fontSize: 6.8,
      });
    }
    document.sectionBreak();
  });
}

function renderAuthority(document: ArtifactPdfDocument, artifact: CanonicalExecutionArtifact): void {
  document.setSection("Authority");
  document.addPage("Authority");
  document.heading("Authority Record", 1);
  artifact.authorities.forEach((authority, index) => {
    document.ensureSpace(150);
    document.heading(`${String(index + 1).padStart(2, "0")} - ${authority.actor.displayName}`, 2);
    document.keyValueGrid([
      { label: "AUTHORITY ID", value: authority.authorityId },
      { label: "STATE", value: authority.state },
      { label: "ACTOR", value: actorLabel(authority.actor) },
      { label: "TYPE", value: authority.authorityType },
      { label: "VALID FROM", value: formatDateTime(authority.validFrom, document.options.locale) },
      { label: "VALID UNTIL", value: formatDateTime(authority.validUntil, document.options.locale) },
      { label: "CONFLICT", value: authority.conflictState },
      { label: "SEPARATION OF DUTIES", value: authority.separationOfDutiesSatisfied ? "Satisfied" : "Not satisfied" },
    ], 2);
    document.labelValue("Authority source", authority.authoritySource);
    document.labelValue("Scope", authority.scope.join("; ") || "None declared");
    document.labelValue("Permitted actions", authority.permittedActions.join("; ") || "None declared");
    document.labelValue("Prohibited actions", authority.prohibitedActions.join("; ") || "None declared");
    document.labelValue("Reason codes", authority.reasonCodes.join(", ") || "None");
    if (document.options.includeAuthorityDelegations && authority.delegationChain.length > 0) {
      document.heading("Delegation chain", 3);
      document.table({
        columns: [
          { key: "grantor", title: "Grantor", width: 130, value: (row) => actorLabel(row.grantor) },
          { key: "grantee", title: "Grantee", width: 130, value: (row) => actorLabel(row.grantee) },
          { key: "scope", title: "Scope", width: 170, value: (row) => row.scope.join("; ") },
          { key: "time", title: "Granted", width: 86, value: (row) => formatDateTime(row.grantedAt, document.options.locale) },
        ],
        rows: authority.delegationChain,
        fontSize: 6.7,
      });
    }
    document.sectionBreak();
  });
}

function renderContinuity(document: ArtifactPdfDocument, artifact: CanonicalExecutionArtifact): void {
  document.setSection("Continuity");
  document.addPage("Continuity");
  document.heading("Continuity Assessment", 1);
  document.keyValueGrid([
    { label: "OVERALL", value: artifact.continuity.overallState },
    { label: "ASSESSED", value: formatDateTime(artifact.continuity.assessedAt, document.options.locale) },
    { label: "IDENTITY", value: artifact.continuity.identityState },
    { label: "EVIDENCE", value: artifact.continuity.evidenceState },
    { label: "ROUTE", value: artifact.continuity.routeState },
    { label: "AUTHORITY", value: artifact.continuity.authorityState },
    { label: "ENVIRONMENT", value: artifact.continuity.environmentState },
    { label: "REASON CODES", value: artifact.continuity.reasonCodes.join(", ") || "None" },
  ], 2);
  document.heading("Changed conditions", 2);
  document.table({
    columns: [
      { key: "path", title: "Field", width: 120, value: (row) => row.fieldPath },
      { key: "before", title: "Previous", width: 135, value: (row) => stringifyJsonValue(row.previousValue) },
      { key: "after", title: "Current", width: 135, value: (row) => stringifyJsonValue(row.currentValue) },
      { key: "material", title: "Material", width: 58, align: "CENTER", value: (row) => row.material ? "YES" : "NO" },
      { key: "detected", title: "Detected", width: 72, value: (row) => formatDateTime(row.detectedAt, document.options.locale) },
    ],
    rows: artifact.continuity.changedFields,
    fontSize: 6.7,
  });
  document.heading("Revalidation events", 2);
  document.table({
    columns: [
      { key: "trigger", title: "Trigger", width: 96, value: (row) => row.triggerId },
      { key: "started", title: "Triggered", width: 110, value: (row) => formatDateTime(row.triggeredAt, document.options.locale) },
      { key: "completed", title: "Completed", width: 110, value: (row) => formatDateTime(row.completedAt, document.options.locale) },
      { key: "result", title: "Result", width: 76, align: "CENTER", value: (row) => row.result },
      { key: "codes", title: "Reason codes", width: 124, value: (row) => row.reasonCodes.join(", ") },
    ],
    rows: artifact.continuity.revalidationEvents,
    fontSize: 6.7,
  });
}

function renderAdmissibility(document: ArtifactPdfDocument, artifact: CanonicalExecutionArtifact): void {
  document.setSection("Admissibility");
  document.addPage("Admissibility");
  document.heading("Admissibility Assessment", 1);
  document.keyValueGrid([
    { label: "OVERALL RESULT", value: artifact.admissibility.overallResult },
    { label: "ASSESSED", value: formatDateTime(artifact.admissibility.assessedAt, document.options.locale) },
    { label: "PURPOSE", value: artifact.admissibility.purpose },
    { label: "CONSEQUENCE CLASS", value: artifact.admissibility.consequenceClass },
    { label: "JURISDICTION", value: artifact.admissibility.jurisdiction },
    { label: "AUTHORITY RESULT", value: artifact.admissibility.authorityResult.result },
  ], 2);
  document.heading("Evidence findings", 2);
  document.table({
    columns: [
      { key: "id", title: "Evidence", width: 98, value: (row) => row.evidenceId },
      { key: "result", title: "Result", width: 82, align: "CENTER", value: (row) => row.result },
      { key: "codes", title: "Reason codes", width: 150, value: (row) => row.reasonCodes.join(", ") },
      { key: "gates", title: "Supported gates", width: 100, value: (row) => row.supportsGateIds.join(", ") },
      { key: "limits", title: "Limitations", width: 86, value: (row) => row.limitations.join("; ") },
    ],
    rows: artifact.admissibility.evidenceResults,
    fontSize: 6.7,
  });
  document.heading("Assessment limitations", 2);
  artifact.admissibility.limitations.forEach((item) => document.paragraph(item, { bullet: "-", indent: 8, after: 2 }));
}

function renderBinding(document: ArtifactPdfDocument, artifact: CanonicalExecutionArtifact): void {
  document.setSection("Binding");
  document.addPage("Binding");
  document.heading("Binding Assessment", 1);
  document.labelValue("Assessed at", formatDateTime(artifact.binding.assessedAt, document.options.locale));
  document.labelValue("Permitted scope", artifact.binding.permittedScope.join("; ") || "None");
  document.labelValue("Prohibited scope", artifact.binding.prohibitedScope.join("; ") || "None");
  document.labelValue("Obligations", artifact.binding.obligations.join("; ") || "None");
  document.labelValue("Prohibitions", artifact.binding.prohibitions.join("; ") || "None");
  document.heading("Applied policies", 2);
  document.table({
    columns: [
      { key: "policy", title: "Policy", width: 98, value: (row) => `${row.policyId} v${row.version}` },
      { key: "facts", title: "Facts applied", width: 190, value: (row) => row.factsApplied.join("; ") },
      { key: "requirement", title: "Resulting requirement", width: 170, value: (row) => row.resultingRequirement },
      { key: "gates", title: "Gates", width: 58, value: (row) => row.gateIds.join(", ") },
    ],
    rows: artifact.binding.appliedPolicies,
    fontSize: 6.7,
  });
  document.heading("Applied thresholds", 2);
  document.table({
    columns: [
      { key: "id", title: "Threshold", width: 105, value: (row) => row.thresholdId },
      { key: "observed", title: "Observed", width: 120, value: (row) => stringifyJsonValue(row.observed) },
      { key: "expected", title: "Expected", width: 120, value: (row) => stringifyJsonValue(row.expected) },
      { key: "satisfied", title: "Satisfied", width: 72, align: "CENTER", value: (row) => row.satisfied ? "YES" : "NO" },
      { key: "effect", title: "Consequence", width: 99, value: (row) => row.consequence },
    ],
    rows: artifact.binding.appliedThresholds,
    fontSize: 6.8,
  });
}

function renderGateLedger(document: ArtifactPdfDocument, artifact: CanonicalExecutionArtifact): void {
  document.setSection("Gate Ledger");
  document.addPage("Gate Ledger");
  document.heading("Runtime Gate Ledger", 1);
  document.paragraph("The earliest unresolved or failed mandatory condition controls the route. Later success cannot erase an earlier governing failure.");
  document.table({
    columns: [
      { key: "seq", title: "#", width: 26, align: "CENTER", value: (row) => String(row.sequence).padStart(2, "0") },
      { key: "link", title: "Anchor", width: 74, value: (row) => row.chainLink },
      { key: "title", title: "Gate", width: 150, value: (row) => row.title },
      { key: "result", title: "Result", width: 64, align: "CENTER", value: (row) => row.result },
      { key: "codes", title: "Reason codes", width: 130, value: (row) => row.reasonCodes.join(", ") },
      { key: "earliest", title: "Earliest", width: 55, align: "CENTER", value: (row) => row.earliestFailure ? "YES" : "" },
    ],
    rows: artifact.gateLedger,
    fontSize: 6.4,
    minimumRowHeight: 24,
  });
  const earliest = artifact.gateLedger.find((entry) => entry.earliestFailure);
  if (earliest) {
    document.callout("EARLIEST CONTROLLING FAILURE", `${earliest.gateId} - ${earliest.chainLink} - ${earliest.title}. ${earliest.repairCondition ?? "No repair condition was recorded."}`, "DANGER");
  } else {
    document.callout("ROUTE RESULT", "No controlling failure was preserved in the gate ledger.", "SUCCESS");
  }
}

function renderCommit(document: ArtifactPdfDocument, artifact: CanonicalExecutionArtifact): void {
  document.setSection("Commit");
  document.addPage("Commit");
  document.heading("Determination Commit", 1);
  document.badge(artifact.commit.determination, determinationColor(artifact.commit.determination, document.theme), document.margins.left, document.y - 18, 100);
  document.moveDown(40);
  document.labelValue("Commit ID", artifact.commit.commitId);
  document.labelValue("Committed at", formatDateTime(artifact.commit.committedAt, document.options.locale));
  document.labelValue("Committed by", actorLabel(artifact.commit.committedBy));
  document.labelValue("Earliest failure gate", artifact.commit.earliestFailureGateId ?? "None");
  document.labelValue("Earliest failure anchor", artifact.commit.earliestFailureChainLink ?? "None");
  document.labelValue("Commit hash", artifact.commit.commitHash ?? "Not recorded");
  document.heading("Explanation", 2);
  document.paragraph(artifact.commit.explanation);
  document.heading("Exact authorized scope", 2);
  artifact.commit.exactAuthorizedScope.forEach((item) => document.paragraph(item, { bullet: "-", indent: 8, after: 2 }));
  document.heading("Permitted next actions", 2);
  artifact.commit.permittedNextActions.forEach((item) => document.paragraph(item, { bullet: "-", indent: 8, after: 2 }));
  document.heading("Prohibited next actions", 2);
  artifact.commit.prohibitedNextActions.forEach((item) => document.paragraph(item, { bullet: "-", indent: 8, after: 2 }));
}

function renderReceipt(document: ArtifactPdfDocument, receipt: ExecutionReceipt, index: number): void {
  document.ensureSpace(210);
  document.heading(`${String(index + 1).padStart(2, "0")} - ${receipt.receiptId}`, 2);
  document.keyValueGrid([
    { label: "DETERMINATION", value: receipt.determination, tone: determinationColor(receipt.determination, document.theme) },
    { label: "EFFECT", value: receipt.effect },
    { label: "ADAPTER", value: `${receipt.adapterId} v${receipt.adapterVersion}` },
    { label: "COMMAND", value: receipt.command },
    { label: "STATUS", value: receipt.technicalStatusCode ?? "Not recorded" },
    { label: "BYPASS DETECTED", value: receipt.bypassDetected ? "YES" : "NO" },
    { label: "STARTED", value: formatDateTime(receipt.startedAt, document.options.locale) },
    { label: "COMPLETED", value: formatDateTime(receipt.completedAt, document.options.locale) },
  ], 2);
  document.labelValue("Attempted action", receipt.attemptedAction);
  document.labelValue("Authorized scope", receipt.authorizedScope.join("; ") || "None");
  document.labelValue("Actual scope", receipt.actualScope.join("; ") || "None");
  document.labelValue("Technical message", receipt.technicalMessage);
  document.labelValue("Receipt hash", receipt.receiptHash ?? "Not recorded");
  if (receipt.bypassDetails) document.labelValue("Bypass details", receipt.bypassDetails);
  if (receipt.externalReceipt) document.labelValue("External receipt", receipt.externalReceipt);
  document.sectionBreak();
}

function renderExecution(document: ArtifactPdfDocument, artifact: CanonicalExecutionArtifact): void {
  document.setSection("Execution");
  document.addPage("Execution");
  document.heading("Execution Requests and Receipts", 1);
  document.heading("Requests", 2);
  document.table({
    columns: [
      { key: "id", title: "Request", width: 98, value: (row) => row.requestId },
      { key: "time", title: "Attempted", width: 112, value: (row) => formatDateTime(row.attemptedAt, document.options.locale) },
      { key: "actor", title: "Actor", width: 130, value: (row) => actorLabel(row.actor) },
      { key: "action", title: "Action", width: 176, value: (row) => row.action },
    ],
    rows: artifact.executionRequests,
    fontSize: 6.8,
  });
  document.heading("Receipts", 2);
  artifact.executionReceipts.forEach((receipt, index) => renderReceipt(document, receipt, index));
}

function renderOutcome(document: ArtifactPdfDocument, artifact: CanonicalExecutionArtifact): void {
  document.setSection("Outcome");
  document.addPage("Outcome");
  document.heading("Outcome Closure", 1);
  const outcome = artifact.outcome;
  if (!outcome) {
    document.callout("OUTCOME NOT CLOSED", "No outcome closure record was preserved for this artifact.", "WARNING");
    return;
  }
  document.keyValueGrid([
    { label: "OUTCOME ID", value: outcome.outcomeId },
    { label: "CONSEQUENCE STATE", value: outcome.consequenceState },
    { label: "CLOSED AT", value: formatDateTime(outcome.closedAt, document.options.locale) },
    { label: "CLOSED BY", value: actorLabel(outcome.closedBy) },
    { label: "EFFECT CONFIRMED", value: outcome.executionEffectConfirmed ? "YES" : "NO" },
    { label: "INDEPENDENTLY VERIFIED", value: outcome.independentlyVerified ? "YES" : "NO" },
  ], 2);
  document.heading("Expected outcome", 2);
  document.paragraph(outcome.expectedOutcome);
  document.heading("Actual outcome", 2);
  document.paragraph(outcome.actualOutcome);
  document.labelValue("Closure evidence", outcome.closureEvidenceIds.join(", ") || "None");
  document.labelValue("Verifier", actorLabel(outcome.verifier));
  document.heading("Verification notes", 2);
  outcome.verificationNotes.forEach((item) => document.paragraph(item, { bullet: "-", indent: 8, after: 2 }));
  document.heading("Residual risks", 2);
  document.table({
    columns: [
      { key: "id", title: "Risk", width: 85, value: (row) => row.riskId },
      { key: "description", title: "Description", width: 210, value: (row) => row.description },
      { key: "severity", title: "Severity", width: 66, value: (row) => row.severity },
      { key: "status", title: "Status", width: 78, value: (row) => row.status },
      { key: "treatment", title: "Treatment", width: 77, value: (row) => row.treatment },
    ],
    rows: outcome.residualRisks,
    fontSize: 6.6,
  });
  document.heading("Corrective actions", 2);
  document.table({
    columns: [
      { key: "id", title: "Action", width: 85, value: (row) => row.actionId },
      { key: "description", title: "Description", width: 245, value: (row) => row.description },
      { key: "owner", title: "Owner", width: 120, value: (row) => actorLabel(row.owner) },
      { key: "status", title: "Status", width: 66, value: (row) => row.status },
    ],
    rows: outcome.correctiveActions,
    fontSize: 6.7,
  });
}

function renderIntegrity(document: ArtifactPdfDocument, artifact: CanonicalExecutionArtifact): void {
  document.setSection("Integrity");
  document.addPage("Integrity");
  document.heading("Integrity Manifest", 1);
  const manifest = artifact.integrity;
  if (!manifest) {
    document.callout("MANIFEST NOT PRESERVED", "The canonical artifact does not contain an integrity manifest.", "WARNING");
    return;
  }
  document.keyValueGrid([
    { label: "HASH ALGORITHM", value: manifest.hashAlgorithm },
    { label: "VERIFICATION LEVEL", value: String(manifest.verificationLevel) },
    { label: "CANONICALIZATION", value: manifest.canonicalizationVersion },
    { label: "VERIFIER", value: manifest.verifierVersion },
    { label: "PARITY CONFIRMED", value: manifest.parityConfirmed ? "YES" : "NO" },
    { label: "GENERATED", value: formatDateTime(manifest.generatedAt, document.options.locale) },
  ], 2);
  document.labelValue("Record hash", manifest.recordHash);
  document.labelValue("Package root hash", manifest.packageRootHash);
  if (manifest.signatureMethod) document.labelValue("Signature method", manifest.signatureMethod);
  if (manifest.publicKeyReference) document.labelValue("Public key", manifest.publicKeyReference);
  if (document.options.includeComponentHashes) {
    document.heading("Component hashes", 2);
    const rows = Object.entries(manifest.componentHashes).map(([component, hash]) => ({ component, hash }));
    document.table({
      columns: [
        { key: "component", title: "Component", width: 175, value: (row) => row.component },
        { key: "hash", title: "SHA-256", width: 341, value: (row) => row.hash },
      ],
      rows,
      fontSize: 6.5,
    });
  }
}

function renderReviews(document: ArtifactPdfDocument, artifact: CanonicalExecutionArtifact): void {
  document.setSection("Reviews");
  document.addPage("Reviews");
  document.heading("Review Record", 1);
  document.table({
    columns: [
      { key: "id", title: "Review", width: 86, value: (row) => row.reviewId },
      { key: "type", title: "Type", width: 82, value: (row) => row.reviewType },
      { key: "reviewer", title: "Reviewer", width: 140, value: (row) => actorLabel(row.reviewer) },
      { key: "time", title: "Reviewed", width: 106, value: (row) => formatDateTime(row.reviewedAt, document.options.locale) },
      { key: "result", title: "Result", width: 66, value: (row) => row.result },
      { key: "findings", title: "Findings", width: 38, align: "CENTER", value: (row) => String(row.findings.length) },
    ],
    rows: artifact.reviews,
    fontSize: 6.6,
  });
  artifact.reviews.forEach((review) => {
    if (review.findings.length === 0) return;
    document.heading(`${review.reviewId} findings`, 2);
    review.findings.forEach((finding) => document.paragraph(`${finding.severity}: ${finding.description}${finding.requiredAction ? ` Required action: ${finding.requiredAction}` : ""}`, { bullet: "-", indent: 8, after: 2 }));
  });
}

function renderChallenges(document: ArtifactPdfDocument, artifact: CanonicalExecutionArtifact): void {
  document.setSection("Challenges");
  document.addPage("Challenges");
  document.heading("Challenges and Amendments", 1);
  document.heading("Challenges", 2);
  document.table({
    columns: [
      { key: "id", title: "Challenge", width: 90, value: (row) => row.challengeId },
      { key: "title", title: "Title", width: 160, value: (row) => row.title },
      { key: "opened", title: "Opened", width: 100, value: (row) => formatDateTime(row.openedAt, document.options.locale) },
      { key: "by", title: "Opened by", width: 120, value: (row) => actorLabel(row.openedBy) },
      { key: "status", title: "Status", width: 82, value: (row) => row.status },
    ],
    rows: artifact.challenges,
    fontSize: 6.7,
  });
  if (document.options.includeAmendments) {
    document.heading("Amendments", 2);
    document.table({
      columns: [
        { key: "id", title: "Amendment", width: 90, value: (row) => row.amendmentId },
        { key: "type", title: "Type", width: 82, value: (row) => row.type },
        { key: "reason", title: "Reason", width: 230, value: (row) => row.reason },
        { key: "time", title: "Created", width: 114, value: (row) => formatDateTime(row.createdAt, document.options.locale) },
      ],
      rows: artifact.amendments,
      fontSize: 6.7,
    });
  }
}

function renderProofBoundary(document: ArtifactPdfDocument, artifact: CanonicalExecutionArtifact): void {
  document.setSection("Proof Boundary");
  document.addPage("Proof Boundary");
  document.heading("What This Artifact Proves", 1);
  artifact.proofBoundary.proves.forEach((item) => document.paragraph(item, { bullet: "-", indent: 8, after: 3 }));
  document.heading("What This Artifact Does Not Prove", 1);
  artifact.proofBoundary.doesNotProve.forEach((item) => document.paragraph(item, { bullet: "-", indent: 8, after: 3 }));
  document.heading("Reliance Conditions", 1);
  artifact.proofBoundary.relianceConditions.forEach((item) => document.paragraph(item, { bullet: "-", indent: 8, after: 3 }));
  document.heading("Known Limitations", 1);
  artifact.proofBoundary.knownLimitations.forEach((item) => document.paragraph(item, { bullet: "-", indent: 8, after: 3 }));
  document.callout("CLAIMS DISCIPLINE", "This artifact is evidence of the bounded event described in the record. It is not universal certification of every future execution, implementation, model, actor, environment, or jurisdiction.", "WARNING");
}

function renderVerification(document: ArtifactPdfDocument, artifact: CanonicalExecutionArtifact, options: ArtifactPdfOptions): void {
  document.setSection("Verification");
  document.addPage("Verification");
  document.heading("Verification Instructions", 1);
  const levels: readonly { level: VerificationLevel; title: string; instruction: string }[] = [
    { level: 0, title: "Presence", instruction: "Confirm that the artifact ID, route ID, receipt IDs, and publication state are present." },
    { level: 1, title: "Schema", instruction: "Validate the canonical JSON against the declared TA-14 execution-artifact schema version." },
    { level: 2, title: "Canonicalization", instruction: "Canonicalize the record with the declared canonicalization version." },
    { level: 3, title: "Component hashes", instruction: "Recompute every disclosed package component hash." },
    { level: 4, title: "Root hash", instruction: "Recompute the package root and compare it with the integrity manifest." },
    { level: 5, title: "Receipt parity", instruction: "Confirm that determination, command, effect, technical status, and outcome correspond." },
    { level: 6, title: "Chain proof", instruction: "Inspect the complete Reality-to-Outcome chain and earliest controlling failure discipline." },
    { level: 7, title: "Independent review", instruction: "Confirm independent verification, signature, timestamp, or registry preservation where claimed." },
  ];
  document.table({
    columns: [
      { key: "level", title: "Level", width: 48, align: "CENTER", value: (row) => String(row.level) },
      { key: "title", title: "Verification", width: 110, value: (row) => row.title },
      { key: "instruction", title: "Required inspection", width: 358, value: (row) => row.instruction },
    ],
    rows: levels,
    fontSize: 7,
  });
  document.labelValue("Artifact ID", artifact.identity.artifactId);
  document.labelValue("Route ID", artifact.route.routeId);
  document.labelValue("Record hash", artifact.integrity?.recordHash ?? "Not recorded");
  document.labelValue("Package root", artifact.integrity?.packageRootHash ?? "Not recorded");
  document.labelValue("Receipt IDs", artifact.executionReceipts.map((receipt) => receipt.receiptId).join(", ") || "None");
  if (options.verificationBaseUrl) {
    document.callout("PUBLIC VERIFICATION", `${options.verificationBaseUrl.replace(/\/$/, "")}/${artifact.identity.slug}`, "INFO");
  }
}

function renderJsonAppendix(document: ArtifactPdfDocument, artifact: CanonicalExecutionArtifact, options: ArtifactPdfOptions): void {
  document.setSection("Canonical JSON Appendix");
  document.addPage("Canonical JSON Appendix");
  document.heading("Canonical JSON Appendix", 1);
  let json = exportCanonicalJson(artifact, true);
  if (json.length > options.maximumAppendixCharacters) {
    json = `${json.slice(0, options.maximumAppendixCharacters)}\n... [TRUNCATED BY PDF PROFILE]`;
    document.warnings.push(`Canonical JSON appendix was truncated at ${options.maximumAppendixCharacters} characters.`);
  }
  const style = document.style("MONO");
  json.split(/\n/).forEach((line) => {
    const wrapped = wrapText(line || " ", document.contentWidth, style);
    wrapped.forEach((wrappedLine) => {
      document.ensureSpace(style.lineHeight + 2);
      document.textLine(wrappedLine, document.margins.left, document.y - style.size, style);
      document.moveDown(style.lineHeight);
    });
  });
}

export function inspectArtifactForPdf(
  artifact: CanonicalExecutionArtifact,
  partialOptions?: Partial<ArtifactPdfOptions>,
): ArtifactPdfInspection {
  const options = normalizeOptions(partialOptions);
  const validation = validateArtifact(artifact);
  const errors = validation.issues.filter((issue) => issue.severity === "ERROR").map((issue) => `${issue.code} at ${issue.path}: ${issue.message}`);
  const warnings = validation.issues.filter((issue) => issue.severity === "WARNING").map((issue) => `${issue.code} at ${issue.path}: ${issue.message}`);
  const projectedSections = selectedSections(options);
  const redactedEvidenceIds = artifact.evidence
    .filter((evidence) => !disclosureAllowed(evidence.disclosureLevel, options.disclosureMode))
    .map((evidence) => evidence.evidenceId);
  const omittedEvidenceIds: string[] = [];
  const projectedPageCount = projectedSections.reduce((sum, section) => sum + estimateSectionPages(section, artifact), options.includeTableOfContents ? 1 : 0);

  if (!artifact.integrity) warnings.push("Integrity manifest is not present; PDF can be generated but cannot claim complete package verification.");
  if (!artifact.outcome) warnings.push("Outcome closure is not present; PDF will clearly mark the route as not closed.");
  if (artifact.identity.publicationState !== "PUBLISHED" && options.disclosureMode === "PUBLIC") warnings.push(`Artifact publication state is ${artifact.identity.publicationState}; public export may be premature.`);
  if (artifact.commit.determination !== artifact.executionReceipts[0]?.determination && artifact.executionReceipts.length > 0) errors.push("Commit determination does not match the first execution receipt determination.");
  if (projectedSections.length === 0) errors.push("No PDF sections were selected.");

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    projectedSections,
    redactedEvidenceIds,
    omittedEvidenceIds,
    projectedPageCount,
  };
}

export function generateExecutionArtifactPdfBytes(
  artifact: CanonicalExecutionArtifact,
  partialOptions?: Partial<ArtifactPdfOptions>,
): { bytes: Uint8Array; pageCount: number; warnings: readonly string[]; options: ArtifactPdfOptions } {
  const options = normalizeOptions(partialOptions);
  const inspection = inspectArtifactForPdf(artifact, options);
  if (!inspection.valid) {
    throw new Error(`TA-14 PDF generation refused:\n${inspection.errors.join("\n")}`);
  }

  const document = new ArtifactPdfDocument(options);
  document.warnings.push(...inspection.warnings);
  const sections = inspection.projectedSections;

  for (const section of sections) {
    switch (section) {
      case "COVER": renderCover(document, artifact, options); break;
      case "EXECUTIVE_SUMMARY": renderExecutiveSummary(document, artifact); break;
      case "CHAIN_OVERVIEW": renderChainOverview(document, artifact); break;
      case "SCENARIO": renderScenario(document, artifact); break;
      case "ROUTE": renderRoute(document, artifact); break;
      case "EVIDENCE": renderEvidence(document, artifact); break;
      case "AUTHORITY": renderAuthority(document, artifact); break;
      case "CONTINUITY": renderContinuity(document, artifact); break;
      case "ADMISSIBILITY": renderAdmissibility(document, artifact); break;
      case "BINDING": renderBinding(document, artifact); break;
      case "GATE_LEDGER": renderGateLedger(document, artifact); break;
      case "COMMIT": renderCommit(document, artifact); break;
      case "EXECUTION": renderExecution(document, artifact); break;
      case "OUTCOME": renderOutcome(document, artifact); break;
      case "INTEGRITY": renderIntegrity(document, artifact); break;
      case "REVIEWS": if (options.includeReviews) renderReviews(document, artifact); break;
      case "CHALLENGES": if (options.includeChallenges) renderChallenges(document, artifact); break;
      case "PROOF_BOUNDARY": renderProofBoundary(document, artifact); break;
      case "VERIFICATION": if (options.includeVerificationInstructions) renderVerification(document, artifact, options); break;
      case "APPENDIX_JSON": if (options.includeCanonicalJsonAppendix) renderJsonAppendix(document, artifact, options); break;
    }
  }

  if (options.includeTableOfContents) {
    const tocDocument = new ArtifactPdfDocument({ ...options, includeTableOfContents: false });
    renderCover(tocDocument, artifact, options);
    renderTableOfContents(tocDocument, sections, artifact);
    for (const section of sections.filter((value) => value !== "COVER")) {
      switch (section) {
        case "EXECUTIVE_SUMMARY": renderExecutiveSummary(tocDocument, artifact); break;
        case "CHAIN_OVERVIEW": renderChainOverview(tocDocument, artifact); break;
        case "SCENARIO": renderScenario(tocDocument, artifact); break;
        case "ROUTE": renderRoute(tocDocument, artifact); break;
        case "EVIDENCE": renderEvidence(tocDocument, artifact); break;
        case "AUTHORITY": renderAuthority(tocDocument, artifact); break;
        case "CONTINUITY": renderContinuity(tocDocument, artifact); break;
        case "ADMISSIBILITY": renderAdmissibility(tocDocument, artifact); break;
        case "BINDING": renderBinding(tocDocument, artifact); break;
        case "GATE_LEDGER": renderGateLedger(tocDocument, artifact); break;
        case "COMMIT": renderCommit(tocDocument, artifact); break;
        case "EXECUTION": renderExecution(tocDocument, artifact); break;
        case "OUTCOME": renderOutcome(tocDocument, artifact); break;
        case "INTEGRITY": renderIntegrity(tocDocument, artifact); break;
        case "REVIEWS": if (options.includeReviews) renderReviews(tocDocument, artifact); break;
        case "CHALLENGES": if (options.includeChallenges) renderChallenges(tocDocument, artifact); break;
        case "PROOF_BOUNDARY": renderProofBoundary(tocDocument, artifact); break;
        case "VERIFICATION": if (options.includeVerificationInstructions) renderVerification(tocDocument, artifact, options); break;
        case "APPENDIX_JSON": if (options.includeCanonicalJsonAppendix) renderJsonAppendix(tocDocument, artifact, options); break;
      }
    }
    const generatedAt = options.generatedAt ?? new Date().toISOString();
    const title = options.documentTitle ?? `${artifact.identity.artifactId} - ${artifact.identity.title}`;
    const subject = options.documentSubject ?? `TA-14 execution artifact ${artifact.commit.determination} proof package`;
    const author = options.documentAuthor ?? options.institutionName;
    const bytes = tocDocument.build({ title, subject, author, keywords: options.documentKeywords, createdAt: generatedAt });
    return { bytes, pageCount: tocDocument.pageCount, warnings: tocDocument.warnings, options };
  }

  const generatedAt = options.generatedAt ?? new Date().toISOString();
  const title = options.documentTitle ?? `${artifact.identity.artifactId} - ${artifact.identity.title}`;
  const subject = options.documentSubject ?? `TA-14 execution artifact ${artifact.commit.determination} proof package`;
  const author = options.documentAuthor ?? options.institutionName;
  const bytes = document.build({ title, subject, author, keywords: options.documentKeywords, createdAt: generatedAt });
  return { bytes, pageCount: document.pageCount, warnings: document.warnings, options };
}

export function generateExecutionArtifactPdf(
  artifact: CanonicalExecutionArtifact,
  partialOptions?: Partial<ArtifactPdfOptions>,
): ArtifactPdfResult {
  const generatedAt = partialOptions?.generatedAt ?? new Date().toISOString();
  const result = generateExecutionArtifactPdfBytes(artifact, { ...partialOptions, generatedAt });
  const filename = createArtifactPdfFilename(artifact, result.options);
  const blob = new Blob([result.bytes], { type: "application/pdf" });
  return {
    bytes: result.bytes,
    blob,
    filename,
    mimeType: "application/pdf",
    pageCount: result.pageCount,
    byteLength: result.bytes.byteLength,
    artifactId: artifact.identity.artifactId,
    determination: artifact.commit.determination,
    disclosureMode: result.options.disclosureMode,
    generatedAt,
    warnings: result.warnings,
  };
}

export function createArtifactPdfFilename(
  artifact: CanonicalExecutionArtifact,
  partialOptions?: Partial<ArtifactPdfOptions>,
): string {
  const options = normalizeOptions(partialOptions);
  const parts = [
    DEFAULT_PDF_FILENAME_PREFIX,
    safeFilenameSegment(artifact.identity.artifactId),
    safeFilenameSegment(artifact.commit.determination),
    safeFilenameSegment(options.disclosureMode),
  ];
  return `${parts.join("_")}.pdf`;
}

export function downloadExecutionArtifactPdf(
  artifact: CanonicalExecutionArtifact,
  partialOptions?: Partial<ArtifactPdfOptions>,
): ArtifactPdfResult {
  if (typeof document === "undefined" || typeof URL === "undefined") {
    throw new Error("downloadExecutionArtifactPdf requires a browser environment. Use generateExecutionArtifactPdfBytes on the server.");
  }
  const result = generateExecutionArtifactPdf(artifact, partialOptions);
  const url = URL.createObjectURL(result.blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = result.filename;
  anchor.rel = "noopener";
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 250);
  return result;
}

export function createPublicPdfOptions(
  overrides?: Partial<ArtifactPdfOptions>,
): ArtifactPdfOptions {
  return normalizeOptions({
    disclosureMode: "PUBLIC",
    includeCanonicalJsonAppendix: false,
    includeEvidenceMetadata: true,
    includeCustodyEvents: true,
    includeAuthorityDelegations: false,
    includeReviews: true,
    includeChallenges: true,
    includeAmendments: true,
    includeComponentHashes: true,
    includeVerificationInstructions: true,
    includeWatermark: false,
    ...overrides,
  });
}

export function createInstitutionalPdfOptions(
  overrides?: Partial<ArtifactPdfOptions>,
): ArtifactPdfOptions {
  return normalizeOptions({
    disclosureMode: "INSTITUTIONAL",
    includeCanonicalJsonAppendix: true,
    includeEvidenceMetadata: true,
    includeCustodyEvents: true,
    includeAuthorityDelegations: true,
    includeReviews: true,
    includeChallenges: true,
    includeAmendments: true,
    includeComponentHashes: true,
    includeVerificationInstructions: true,
    includeWatermark: true,
    watermarkText: "INSTITUTIONAL REVIEW COPY",
    ...overrides,
  });
}

export function createSelectivePdfOptions(
  overrides?: Partial<ArtifactPdfOptions>,
): ArtifactPdfOptions {
  return normalizeOptions({
    disclosureMode: "SELECTIVE",
    includeCanonicalJsonAppendix: false,
    includeEvidenceMetadata: true,
    includeCustodyEvents: true,
    includeAuthorityDelegations: false,
    includeReviews: true,
    includeChallenges: true,
    includeAmendments: true,
    includeComponentHashes: true,
    includeVerificationInstructions: true,
    includeWatermark: true,
    watermarkText: "SELECTIVE DISCLOSURE COPY",
    ...overrides,
  });
}

export function createArtifactPdfPackageDescriptor(
  artifact: CanonicalExecutionArtifact,
  partialOptions?: Partial<ArtifactPdfOptions>,
): JsonObject {
  const options = normalizeOptions(partialOptions);
  const inspection = inspectArtifactForPdf(artifact, options);
  return {
    profile: ARTIFACT_PDF_PROFILE,
    engineVersion: ARTIFACT_PDF_ENGINE_VERSION,
    artifactId: artifact.identity.artifactId,
    routeId: artifact.route.routeId,
    determination: artifact.commit.determination,
    disclosureMode: options.disclosureMode,
    filename: createArtifactPdfFilename(artifact, options),
    selectedSections: [...inspection.projectedSections],
    projectedPageCount: inspection.projectedPageCount,
    redactedEvidenceIds: [...inspection.redactedEvidenceIds],
    warnings: [...inspection.warnings],
    valid: inspection.valid,
  } as JsonObject;
}

export function artifactPdfEngineSelfCheck(): readonly string[] {
  const issues: string[] = [];
  const requiredSections: readonly PdfSectionId[] = [
    "COVER",
    "EXECUTIVE_SUMMARY",
    "CHAIN_OVERVIEW",
    "SCENARIO",
    "ROUTE",
    "EVIDENCE",
    "AUTHORITY",
    "CONTINUITY",
    "ADMISSIBILITY",
    "BINDING",
    "GATE_LEDGER",
    "COMMIT",
    "EXECUTION",
    "OUTCOME",
    "INTEGRITY",
    "PROOF_BOUNDARY",
    "VERIFICATION",
  ];
  for (const section of requiredSections) {
    if (!DEFAULT_SECTION_ORDER.includes(section)) issues.push(`Missing default PDF section: ${section}`);
    if (!SECTION_TITLES[section]) issues.push(`Missing PDF section title: ${section}`);
  }
  if (ARTIFACT_PDF_ENGINE_VERSION.trim().length === 0) issues.push("PDF engine version is empty.");
  if (ARTIFACT_PDF_PROFILE.trim().length === 0) issues.push("PDF profile is empty.");
  if (DEFAULT_ARTIFACT_PDF_OPTIONS.maximumAppendixCharacters < 1000) issues.push("Canonical JSON appendix limit is too small.");
  if (PAGE_SIZES.LETTER.width <= 0 || PAGE_SIZES.LETTER.height <= 0) issues.push("Letter page size is invalid.");
  return issues;
}

export interface ArtifactPdfControlDefinition {
  controlId: string;
  title: string;
  requirement: string;
  mandatory: boolean;
}

export const ARTIFACT_PDF_CONTROLS: readonly ArtifactPdfControlDefinition[] = [
  {
    controlId: "PDF-CONTROL-001",
    title: "Artifact identity parity",
    requirement: "The PDF artifact ID, series ID, sequence, title, slug, route ID, and determination must match the canonical record.",
    mandatory: true,
  },
  {
    controlId: "PDF-CONTROL-002",
    title: "Deterministic section ordering",
    requirement: "Default sections render in one declared order so reviewers can compare artifacts without searching for material fields.",
    mandatory: true,
  },
  {
    controlId: "PDF-CONTROL-003",
    title: "Disclosure enforcement",
    requirement: "Evidence is projected according to PUBLIC, SELECTIVE, or INSTITUTIONAL disclosure mode.",
    mandatory: true,
  },
  {
    controlId: "PDF-CONTROL-004",
    title: "Redaction transparency",
    requirement: "Withheld evidence remains visibly represented by identity and state rather than silently disappearing.",
    mandatory: true,
  },
  {
    controlId: "PDF-CONTROL-005",
    title: "Commit-receipt parity",
    requirement: "The committed determination must correspond to each execution receipt included in the artifact.",
    mandatory: true,
  },
  {
    controlId: "PDF-CONTROL-006",
    title: "Receipt-outcome parity",
    requirement: "Execution effects and the preserved consequence state must not contradict one another.",
    mandatory: true,
  },
  {
    controlId: "PDF-CONTROL-007",
    title: "Earliest-failure visibility",
    requirement: "The earliest controlling failure must be visually identifiable in the runtime gate ledger.",
    mandatory: true,
  },
  {
    controlId: "PDF-CONTROL-008",
    title: "Chain completeness",
    requirement: "Reality, Record, Continuity, Admissibility, Binding, Commit, Execution, and Outcome remain visible.",
    mandatory: true,
  },
  {
    controlId: "PDF-CONTROL-009",
    title: "Page provenance",
    requirement: "Every page carries institutional identity, section identity, page count, and the governing principle.",
    mandatory: true,
  },
  {
    controlId: "PDF-CONTROL-010",
    title: "Hash visibility",
    requirement: "Record, package-root, component, commit, evidence, and receipt hashes remain inspectable where disclosed.",
    mandatory: true,
  },
  {
    controlId: "PDF-CONTROL-011",
    title: "Claims boundary",
    requirement: "What the artifact proves and does not prove must be separate, explicit sections.",
    mandatory: true,
  },
  {
    controlId: "PDF-CONTROL-012",
    title: "Outcome closure",
    requirement: "Missing outcome closure must be disclosed rather than inferred from execution status.",
    mandatory: true,
  },
  {
    controlId: "PDF-CONTROL-013",
    title: "Authority traceability",
    requirement: "Authority source, scope, validity, conflict state, and delegation remain attributable.",
    mandatory: true,
  },
  {
    controlId: "PDF-CONTROL-014",
    title: "Evidence custody",
    requirement: "Custody events remain linked to the evidence record when the selected profile permits disclosure.",
    mandatory: true,
  },
  {
    controlId: "PDF-CONTROL-015",
    title: "Canonical JSON authority",
    requirement: "The PDF identifies canonical JSON as the machine-verification source of truth.",
    mandatory: true,
  },
  {
    controlId: "PDF-CONTROL-016",
    title: "No external dependency",
    requirement: "Generation does not require a hosted PDF service or third-party PDF package.",
    mandatory: true,
  },
  {
    controlId: "PDF-CONTROL-017",
    title: "Browser-safe download",
    requirement: "Blob URLs are revoked with URL.revokeObjectURL after the browser begins the download.",
    mandatory: true,
  },
  {
    controlId: "PDF-CONTROL-018",
    title: "Server-safe bytes",
    requirement: "Server callers can generate Uint8Array output without document, window, or URL globals.",
    mandatory: true,
  },
  {
    controlId: "PDF-CONTROL-019",
    title: "ASCII-safe typography",
    requirement: "Unsupported punctuation is normalized so standard PDF fonts render reliably.",
    mandatory: true,
  },
  {
    controlId: "PDF-CONTROL-020",
    title: "Expandable tables",
    requirement: "Table rows calculate height from wrapped content and never use a fixed clipping height.",
    mandatory: true,
  },
  {
    controlId: "PDF-CONTROL-021",
    title: "Repeated table headers",
    requirement: "Long tables repeat their headers after an automatic page break.",
    mandatory: true,
  },
  {
    controlId: "PDF-CONTROL-022",
    title: "Versioned profile",
    requirement: "The PDF engine and profile versions are embedded in metadata and package descriptors.",
    mandatory: true,
  },
  {
    controlId: "PDF-CONTROL-023",
    title: "Preflight refusal",
    requirement: "Generation refuses artifacts with canonical validation errors or internal determination contradictions.",
    mandatory: true,
  },
  {
    controlId: "PDF-CONTROL-024",
    title: "Verification instructions",
    requirement: "Every public proof PDF may carry the seven-level verification procedure.",
    mandatory: true,
  },
];

export interface ArtifactPdfAcceptanceCheck {
  checkId: string;
  category: string;
  question: string;
  expectedEvidence: string;
}

export const ARTIFACT_PDF_ACCEPTANCE_CHECKS: readonly ArtifactPdfAcceptanceCheck[] = [
  {
    checkId: "PDF-ACCEPT-001",
    category: "IDENTITY",
    question: "Does the identity section preserve canonical identity and attribution?",
    expectedEvidence: "Visible identifiers and attributable source fields for identity.",
  },
  {
    checkId: "PDF-ACCEPT-002",
    category: "IDENTITY",
    question: "Does the identity section distinguish known facts from assumptions?",
    expectedEvidence: "Separate fact, assumption, limitation, and unresolved-state language.",
  },
  {
    checkId: "PDF-ACCEPT-003",
    category: "IDENTITY",
    question: "Does the identity section preserve relevant timestamps?",
    expectedEvidence: "At least one canonical timestamp rendered with timezone context.",
  },
  {
    checkId: "PDF-ACCEPT-004",
    category: "IDENTITY",
    question: "Does the identity section expose governing reason codes where applicable?",
    expectedEvidence: "Reason-code values remain searchable and human readable.",
  },
  {
    checkId: "PDF-ACCEPT-005",
    category: "IDENTITY",
    question: "Does the identity section avoid silently omitting restricted material?",
    expectedEvidence: "Redaction or omission notice preserving record identity.",
  },
  {
    checkId: "PDF-ACCEPT-006",
    category: "IDENTITY",
    question: "Does the identity section remain readable after automatic page breaks?",
    expectedEvidence: "No clipping, overlap, orphaned heading, or missing repeated header.",
  },
  {
    checkId: "PDF-ACCEPT-007",
    category: "SCENARIO",
    question: "Does the scenario section preserve canonical identity and attribution?",
    expectedEvidence: "Visible identifiers and attributable source fields for scenario.",
  },
  {
    checkId: "PDF-ACCEPT-008",
    category: "SCENARIO",
    question: "Does the scenario section distinguish known facts from assumptions?",
    expectedEvidence: "Separate fact, assumption, limitation, and unresolved-state language.",
  },
  {
    checkId: "PDF-ACCEPT-009",
    category: "SCENARIO",
    question: "Does the scenario section preserve relevant timestamps?",
    expectedEvidence: "At least one canonical timestamp rendered with timezone context.",
  },
  {
    checkId: "PDF-ACCEPT-010",
    category: "SCENARIO",
    question: "Does the scenario section expose governing reason codes where applicable?",
    expectedEvidence: "Reason-code values remain searchable and human readable.",
  },
  {
    checkId: "PDF-ACCEPT-011",
    category: "SCENARIO",
    question: "Does the scenario section avoid silently omitting restricted material?",
    expectedEvidence: "Redaction or omission notice preserving record identity.",
  },
  {
    checkId: "PDF-ACCEPT-012",
    category: "SCENARIO",
    question: "Does the scenario section remain readable after automatic page breaks?",
    expectedEvidence: "No clipping, overlap, orphaned heading, or missing repeated header.",
  },
  {
    checkId: "PDF-ACCEPT-013",
    category: "ROUTE",
    question: "Does the route section preserve canonical identity and attribution?",
    expectedEvidence: "Visible identifiers and attributable source fields for route.",
  },
  {
    checkId: "PDF-ACCEPT-014",
    category: "ROUTE",
    question: "Does the route section distinguish known facts from assumptions?",
    expectedEvidence: "Separate fact, assumption, limitation, and unresolved-state language.",
  },
  {
    checkId: "PDF-ACCEPT-015",
    category: "ROUTE",
    question: "Does the route section preserve relevant timestamps?",
    expectedEvidence: "At least one canonical timestamp rendered with timezone context.",
  },
  {
    checkId: "PDF-ACCEPT-016",
    category: "ROUTE",
    question: "Does the route section expose governing reason codes where applicable?",
    expectedEvidence: "Reason-code values remain searchable and human readable.",
  },
  {
    checkId: "PDF-ACCEPT-017",
    category: "ROUTE",
    question: "Does the route section avoid silently omitting restricted material?",
    expectedEvidence: "Redaction or omission notice preserving record identity.",
  },
  {
    checkId: "PDF-ACCEPT-018",
    category: "ROUTE",
    question: "Does the route section remain readable after automatic page breaks?",
    expectedEvidence: "No clipping, overlap, orphaned heading, or missing repeated header.",
  },
  {
    checkId: "PDF-ACCEPT-019",
    category: "EVIDENCE",
    question: "Does the evidence section preserve canonical identity and attribution?",
    expectedEvidence: "Visible identifiers and attributable source fields for evidence.",
  },
  {
    checkId: "PDF-ACCEPT-020",
    category: "EVIDENCE",
    question: "Does the evidence section distinguish known facts from assumptions?",
    expectedEvidence: "Separate fact, assumption, limitation, and unresolved-state language.",
  },
  {
    checkId: "PDF-ACCEPT-021",
    category: "EVIDENCE",
    question: "Does the evidence section preserve relevant timestamps?",
    expectedEvidence: "At least one canonical timestamp rendered with timezone context.",
  },
  {
    checkId: "PDF-ACCEPT-022",
    category: "EVIDENCE",
    question: "Does the evidence section expose governing reason codes where applicable?",
    expectedEvidence: "Reason-code values remain searchable and human readable.",
  },
  {
    checkId: "PDF-ACCEPT-023",
    category: "EVIDENCE",
    question: "Does the evidence section avoid silently omitting restricted material?",
    expectedEvidence: "Redaction or omission notice preserving record identity.",
  },
  {
    checkId: "PDF-ACCEPT-024",
    category: "EVIDENCE",
    question: "Does the evidence section remain readable after automatic page breaks?",
    expectedEvidence: "No clipping, overlap, orphaned heading, or missing repeated header.",
  },
  {
    checkId: "PDF-ACCEPT-025",
    category: "AUTHORITY",
    question: "Does the authority section preserve canonical identity and attribution?",
    expectedEvidence: "Visible identifiers and attributable source fields for authority.",
  },
  {
    checkId: "PDF-ACCEPT-026",
    category: "AUTHORITY",
    question: "Does the authority section distinguish known facts from assumptions?",
    expectedEvidence: "Separate fact, assumption, limitation, and unresolved-state language.",
  },
  {
    checkId: "PDF-ACCEPT-027",
    category: "AUTHORITY",
    question: "Does the authority section preserve relevant timestamps?",
    expectedEvidence: "At least one canonical timestamp rendered with timezone context.",
  },
  {
    checkId: "PDF-ACCEPT-028",
    category: "AUTHORITY",
    question: "Does the authority section expose governing reason codes where applicable?",
    expectedEvidence: "Reason-code values remain searchable and human readable.",
  },
  {
    checkId: "PDF-ACCEPT-029",
    category: "AUTHORITY",
    question: "Does the authority section avoid silently omitting restricted material?",
    expectedEvidence: "Redaction or omission notice preserving record identity.",
  },
  {
    checkId: "PDF-ACCEPT-030",
    category: "AUTHORITY",
    question: "Does the authority section remain readable after automatic page breaks?",
    expectedEvidence: "No clipping, overlap, orphaned heading, or missing repeated header.",
  },
  {
    checkId: "PDF-ACCEPT-031",
    category: "CONTINUITY",
    question: "Does the continuity section preserve canonical identity and attribution?",
    expectedEvidence: "Visible identifiers and attributable source fields for continuity.",
  },
  {
    checkId: "PDF-ACCEPT-032",
    category: "CONTINUITY",
    question: "Does the continuity section distinguish known facts from assumptions?",
    expectedEvidence: "Separate fact, assumption, limitation, and unresolved-state language.",
  },
  {
    checkId: "PDF-ACCEPT-033",
    category: "CONTINUITY",
    question: "Does the continuity section preserve relevant timestamps?",
    expectedEvidence: "At least one canonical timestamp rendered with timezone context.",
  },
  {
    checkId: "PDF-ACCEPT-034",
    category: "CONTINUITY",
    question: "Does the continuity section expose governing reason codes where applicable?",
    expectedEvidence: "Reason-code values remain searchable and human readable.",
  },
  {
    checkId: "PDF-ACCEPT-035",
    category: "CONTINUITY",
    question: "Does the continuity section avoid silently omitting restricted material?",
    expectedEvidence: "Redaction or omission notice preserving record identity.",
  },
  {
    checkId: "PDF-ACCEPT-036",
    category: "CONTINUITY",
    question: "Does the continuity section remain readable after automatic page breaks?",
    expectedEvidence: "No clipping, overlap, orphaned heading, or missing repeated header.",
  },
  {
    checkId: "PDF-ACCEPT-037",
    category: "ADMISSIBILITY",
    question: "Does the admissibility section preserve canonical identity and attribution?",
    expectedEvidence: "Visible identifiers and attributable source fields for admissibility.",
  },
  {
    checkId: "PDF-ACCEPT-038",
    category: "ADMISSIBILITY",
    question: "Does the admissibility section distinguish known facts from assumptions?",
    expectedEvidence: "Separate fact, assumption, limitation, and unresolved-state language.",
  },
  {
    checkId: "PDF-ACCEPT-039",
    category: "ADMISSIBILITY",
    question: "Does the admissibility section preserve relevant timestamps?",
    expectedEvidence: "At least one canonical timestamp rendered with timezone context.",
  },
  {
    checkId: "PDF-ACCEPT-040",
    category: "ADMISSIBILITY",
    question: "Does the admissibility section expose governing reason codes where applicable?",
    expectedEvidence: "Reason-code values remain searchable and human readable.",
  },
  {
    checkId: "PDF-ACCEPT-041",
    category: "ADMISSIBILITY",
    question: "Does the admissibility section avoid silently omitting restricted material?",
    expectedEvidence: "Redaction or omission notice preserving record identity.",
  },
  {
    checkId: "PDF-ACCEPT-042",
    category: "ADMISSIBILITY",
    question: "Does the admissibility section remain readable after automatic page breaks?",
    expectedEvidence: "No clipping, overlap, orphaned heading, or missing repeated header.",
  },
  {
    checkId: "PDF-ACCEPT-043",
    category: "BINDING",
    question: "Does the binding section preserve canonical identity and attribution?",
    expectedEvidence: "Visible identifiers and attributable source fields for binding.",
  },
  {
    checkId: "PDF-ACCEPT-044",
    category: "BINDING",
    question: "Does the binding section distinguish known facts from assumptions?",
    expectedEvidence: "Separate fact, assumption, limitation, and unresolved-state language.",
  },
  {
    checkId: "PDF-ACCEPT-045",
    category: "BINDING",
    question: "Does the binding section preserve relevant timestamps?",
    expectedEvidence: "At least one canonical timestamp rendered with timezone context.",
  },
  {
    checkId: "PDF-ACCEPT-046",
    category: "BINDING",
    question: "Does the binding section expose governing reason codes where applicable?",
    expectedEvidence: "Reason-code values remain searchable and human readable.",
  },
  {
    checkId: "PDF-ACCEPT-047",
    category: "BINDING",
    question: "Does the binding section avoid silently omitting restricted material?",
    expectedEvidence: "Redaction or omission notice preserving record identity.",
  },
  {
    checkId: "PDF-ACCEPT-048",
    category: "BINDING",
    question: "Does the binding section remain readable after automatic page breaks?",
    expectedEvidence: "No clipping, overlap, orphaned heading, or missing repeated header.",
  },
  {
    checkId: "PDF-ACCEPT-049",
    category: "COMMIT",
    question: "Does the commit section preserve canonical identity and attribution?",
    expectedEvidence: "Visible identifiers and attributable source fields for commit.",
  },
  {
    checkId: "PDF-ACCEPT-050",
    category: "COMMIT",
    question: "Does the commit section distinguish known facts from assumptions?",
    expectedEvidence: "Separate fact, assumption, limitation, and unresolved-state language.",
  },
  {
    checkId: "PDF-ACCEPT-051",
    category: "COMMIT",
    question: "Does the commit section preserve relevant timestamps?",
    expectedEvidence: "At least one canonical timestamp rendered with timezone context.",
  },
  {
    checkId: "PDF-ACCEPT-052",
    category: "COMMIT",
    question: "Does the commit section expose governing reason codes where applicable?",
    expectedEvidence: "Reason-code values remain searchable and human readable.",
  },
  {
    checkId: "PDF-ACCEPT-053",
    category: "COMMIT",
    question: "Does the commit section avoid silently omitting restricted material?",
    expectedEvidence: "Redaction or omission notice preserving record identity.",
  },
  {
    checkId: "PDF-ACCEPT-054",
    category: "COMMIT",
    question: "Does the commit section remain readable after automatic page breaks?",
    expectedEvidence: "No clipping, overlap, orphaned heading, or missing repeated header.",
  },
  {
    checkId: "PDF-ACCEPT-055",
    category: "EXECUTION",
    question: "Does the execution section preserve canonical identity and attribution?",
    expectedEvidence: "Visible identifiers and attributable source fields for execution.",
  },
  {
    checkId: "PDF-ACCEPT-056",
    category: "EXECUTION",
    question: "Does the execution section distinguish known facts from assumptions?",
    expectedEvidence: "Separate fact, assumption, limitation, and unresolved-state language.",
  },
  {
    checkId: "PDF-ACCEPT-057",
    category: "EXECUTION",
    question: "Does the execution section preserve relevant timestamps?",
    expectedEvidence: "At least one canonical timestamp rendered with timezone context.",
  },
  {
    checkId: "PDF-ACCEPT-058",
    category: "EXECUTION",
    question: "Does the execution section expose governing reason codes where applicable?",
    expectedEvidence: "Reason-code values remain searchable and human readable.",
  },
  {
    checkId: "PDF-ACCEPT-059",
    category: "EXECUTION",
    question: "Does the execution section avoid silently omitting restricted material?",
    expectedEvidence: "Redaction or omission notice preserving record identity.",
  },
  {
    checkId: "PDF-ACCEPT-060",
    category: "EXECUTION",
    question: "Does the execution section remain readable after automatic page breaks?",
    expectedEvidence: "No clipping, overlap, orphaned heading, or missing repeated header.",
  },
  {
    checkId: "PDF-ACCEPT-061",
    category: "OUTCOME",
    question: "Does the outcome section preserve canonical identity and attribution?",
    expectedEvidence: "Visible identifiers and attributable source fields for outcome.",
  },
  {
    checkId: "PDF-ACCEPT-062",
    category: "OUTCOME",
    question: "Does the outcome section distinguish known facts from assumptions?",
    expectedEvidence: "Separate fact, assumption, limitation, and unresolved-state language.",
  },
  {
    checkId: "PDF-ACCEPT-063",
    category: "OUTCOME",
    question: "Does the outcome section preserve relevant timestamps?",
    expectedEvidence: "At least one canonical timestamp rendered with timezone context.",
  },
  {
    checkId: "PDF-ACCEPT-064",
    category: "OUTCOME",
    question: "Does the outcome section expose governing reason codes where applicable?",
    expectedEvidence: "Reason-code values remain searchable and human readable.",
  },
  {
    checkId: "PDF-ACCEPT-065",
    category: "OUTCOME",
    question: "Does the outcome section avoid silently omitting restricted material?",
    expectedEvidence: "Redaction or omission notice preserving record identity.",
  },
  {
    checkId: "PDF-ACCEPT-066",
    category: "OUTCOME",
    question: "Does the outcome section remain readable after automatic page breaks?",
    expectedEvidence: "No clipping, overlap, orphaned heading, or missing repeated header.",
  },
  {
    checkId: "PDF-ACCEPT-067",
    category: "INTEGRITY",
    question: "Does the integrity section preserve canonical identity and attribution?",
    expectedEvidence: "Visible identifiers and attributable source fields for integrity.",
  },
  {
    checkId: "PDF-ACCEPT-068",
    category: "INTEGRITY",
    question: "Does the integrity section distinguish known facts from assumptions?",
    expectedEvidence: "Separate fact, assumption, limitation, and unresolved-state language.",
  },
  {
    checkId: "PDF-ACCEPT-069",
    category: "INTEGRITY",
    question: "Does the integrity section preserve relevant timestamps?",
    expectedEvidence: "At least one canonical timestamp rendered with timezone context.",
  },
  {
    checkId: "PDF-ACCEPT-070",
    category: "INTEGRITY",
    question: "Does the integrity section expose governing reason codes where applicable?",
    expectedEvidence: "Reason-code values remain searchable and human readable.",
  },
  {
    checkId: "PDF-ACCEPT-071",
    category: "INTEGRITY",
    question: "Does the integrity section avoid silently omitting restricted material?",
    expectedEvidence: "Redaction or omission notice preserving record identity.",
  },
  {
    checkId: "PDF-ACCEPT-072",
    category: "INTEGRITY",
    question: "Does the integrity section remain readable after automatic page breaks?",
    expectedEvidence: "No clipping, overlap, orphaned heading, or missing repeated header.",
  },
];

export interface ArtifactPdfProfileDefinition {
  profileId: string;
  title: string;
  disclosureMode: PdfDisclosureMode;
  includeCanonicalJsonAppendix: boolean;
  includeEvidenceMetadata: boolean;
  includeVerificationInstructions: boolean;
  sections: readonly PdfSectionId[];
}

export const ARTIFACT_PDF_PROFILES: readonly ArtifactPdfProfileDefinition[] = [
  {
    profileId: "PUBLIC_PROOF",
    title: "Public Proof Package",
    disclosureMode: "PUBLIC",
    includeCanonicalJsonAppendix: false,
    includeEvidenceMetadata: true,
    includeVerificationInstructions: true,
    sections: [
      "COVER",
      "EXECUTIVE_SUMMARY",
      "CHAIN_OVERVIEW",
      "SCENARIO",
      "ROUTE",
      "EVIDENCE",
      "AUTHORITY",
      "CONTINUITY",
      "ADMISSIBILITY",
      "BINDING",
      "GATE_LEDGER",
      "COMMIT",
      "EXECUTION",
      "OUTCOME",
      "INTEGRITY",
      "REVIEWS",
      "CHALLENGES",
      "PROOF_BOUNDARY",
      "VERIFICATION",
    ],
  },
  {
    profileId: "SELECTIVE_REVIEW",
    title: "Selective Review Package",
    disclosureMode: "SELECTIVE",
    includeCanonicalJsonAppendix: false,
    includeEvidenceMetadata: true,
    includeVerificationInstructions: true,
    sections: [
      "COVER",
      "EXECUTIVE_SUMMARY",
      "CHAIN_OVERVIEW",
      "SCENARIO",
      "ROUTE",
      "EVIDENCE",
      "AUTHORITY",
      "CONTINUITY",
      "ADMISSIBILITY",
      "BINDING",
      "GATE_LEDGER",
      "COMMIT",
      "EXECUTION",
      "OUTCOME",
      "INTEGRITY",
      "REVIEWS",
      "CHALLENGES",
      "PROOF_BOUNDARY",
      "VERIFICATION",
    ],
  },
  {
    profileId: "INSTITUTIONAL_RECORD",
    title: "Institutional Record Package",
    disclosureMode: "INSTITUTIONAL",
    includeCanonicalJsonAppendix: true,
    includeEvidenceMetadata: true,
    includeVerificationInstructions: true,
    sections: [
      "COVER",
      "EXECUTIVE_SUMMARY",
      "CHAIN_OVERVIEW",
      "SCENARIO",
      "ROUTE",
      "EVIDENCE",
      "AUTHORITY",
      "CONTINUITY",
      "ADMISSIBILITY",
      "BINDING",
      "GATE_LEDGER",
      "COMMIT",
      "EXECUTION",
      "OUTCOME",
      "INTEGRITY",
      "REVIEWS",
      "CHALLENGES",
      "PROOF_BOUNDARY",
      "VERIFICATION",
      "APPENDIX_JSON",
    ],
  },
  {
    profileId: "EXECUTIVE_BRIEF",
    title: "Executive Brief",
    disclosureMode: "PUBLIC",
    includeCanonicalJsonAppendix: false,
    includeEvidenceMetadata: false,
    includeVerificationInstructions: false,
    sections: [
      "COVER",
      "EXECUTIVE_SUMMARY",
      "CHAIN_OVERVIEW",
      "COMMIT",
      "EXECUTION",
      "OUTCOME",
      "PROOF_BOUNDARY",
    ],
  },
  {
    profileId: "VERIFICATION_ONLY",
    title: "Verification-Only Package",
    disclosureMode: "PUBLIC",
    includeCanonicalJsonAppendix: false,
    includeEvidenceMetadata: false,
    includeVerificationInstructions: true,
    sections: [
      "COVER",
      "EXECUTIVE_SUMMARY",
      "GATE_LEDGER",
      "COMMIT",
      "EXECUTION",
      "OUTCOME",
      "INTEGRITY",
      "VERIFICATION",
      "PROOF_BOUNDARY",
    ],
  },
];

export function optionsFromPdfProfile(
  profileId: string,
  overrides?: Partial<ArtifactPdfOptions>,
): ArtifactPdfOptions {
  const profile = ARTIFACT_PDF_PROFILES.find((entry) => entry.profileId === profileId);
  if (!profile) throw new Error(`Unknown artifact PDF profile: ${profileId}`);
  return normalizeOptions({
    disclosureMode: profile.disclosureMode,
    includeCanonicalJsonAppendix: profile.includeCanonicalJsonAppendix,
    includeEvidenceMetadata: profile.includeEvidenceMetadata,
    includeVerificationInstructions: profile.includeVerificationInstructions,
    selectedSections: profile.sections,
    ...overrides,
  });
}

export interface ArtifactPdfGlossaryEntry {
  term: string;
  definition: string;
}

export const ARTIFACT_PDF_GLOSSARY: readonly ArtifactPdfGlossaryEntry[] = [
  {
    term: "Artifact PDF",
    definition: "Human-readable projection of one canonical execution artifact.",
  },
  {
    term: "Canonical JSON",
    definition: "Machine-verifiable source record from which the PDF is projected.",
  },
  {
    term: "Disclosure mode",
    definition: "Rule controlling which evidence contents may appear in the generated document.",
  },
  {
    term: "Public proof",
    definition: "PDF profile intended for unrestricted inspection.",
  },
  {
    term: "Selective review",
    definition: "PDF profile that includes selective evidence while preserving withheld content notices.",
  },
  {
    term: "Institutional record",
    definition: "Full review profile intended for authorized institutional reviewers.",
  },
  {
    term: "Receipt parity",
    definition: "Correspondence among determination, command, effect, technical status, and outcome.",
  },
  {
    term: "Chain proof",
    definition: "Visible preservation of Reality through Outcome.",
  },
  {
    term: "Earliest controlling failure",
    definition: "First mandatory unresolved or failed condition that controls the route.",
  },
  {
    term: "Claims boundary",
    definition: "Explicit separation between what one artifact proves and what it cannot prove.",
  },
  {
    term: "Package root hash",
    definition: "Integrity value representing the disclosed artifact package as a whole.",
  },
  {
    term: "Component hash",
    definition: "Integrity value representing one package component.",
  },
  {
    term: "Outcome closure",
    definition: "Preserved record of the real-world result and residual condition.",
  },
  {
    term: "Redaction notice",
    definition: "Visible statement that content remains governed but is not disclosed in the selected lane.",
  },
  {
    term: "Verification level",
    definition: "Declared depth of artifact inspection from presence through independent review.",
  },
  {
    term: "Projection warning",
    definition: "Notice that the PDF does not replace canonical machine-verification material.",
  },
];

export const ARTIFACT_PDF_ENGINE_SELF_CHECK = artifactPdfEngineSelfCheck();

if (ARTIFACT_PDF_ENGINE_SELF_CHECK.length > 0) {
  throw new Error(`TA-14 Artifact PDF Engine self-check failed: ${ARTIFACT_PDF_ENGINE_SELF_CHECK.join(" | ")}`);
}
