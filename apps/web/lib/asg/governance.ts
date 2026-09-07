export type ASGState = "ALLOW" | "HOLD" | "DENY" | "ESCALATE";
export type ASGProfile = "entertainment" | "navigation" | "general-factual" | "current-events" | "high-consequence" | "research";

export type Candidate = {
  id: string;
  providerRank: number;
  title: string;
  url: string;
  snippet?: string;
  mediaType?: string;
  publishedAt?: string;
  canonicalHost?: string;
  duplicateOf?: string;
  metadata?: Record<string, unknown>;
};

export type Determination = {
  state: ASGState;
  reasonCode: string;
  explanation: string;
  evaluationTier: "T0" | "T1" | "T2" | "T3" | "T4";
};

const HIGH_CONSEQUENCE = /\b(medical|medicine|diagnosis|dose|dosage|legal advice|lawsuit|investment|financial advice|suicide|self-harm|emergency)\b/i;
const CURRENT = /\b(today|latest|current|breaking|right now|this week)\b/i;
const RESEARCH = /\b(study|research|paper|doi|journal|dataset|report)\b/i;
const VIDEO = /\b(video|watch|youtube|clip)\b/i;
const ENTERTAINMENT = /\b(funny|kitten|kitty|cat|dog|meme|music|movie|trailer)\b/i;
const BOOK_REQUEST = /\b(book|books|published books|bibliography|kindle|isbn)\b/i;
const BOOK_EVIDENCE = /\b(book|books|kindle|ebook|paperback|hardcover|isbn|author of|published works|published a new book|wrote and published)\b/i;
const CLEAR_NON_BOOK_PAGE = /\b(obituary|license detail|professional profile|linkedin profile|instagram profile|facebook group|article|blog post|hvac industry professional)\b/i;

export function classifyProfile(request: string): ASGProfile {
  if (HIGH_CONSEQUENCE.test(request)) return "high-consequence";
  if (CURRENT.test(request)) return "current-events";
  if (RESEARCH.test(request)) return "research";
  if (ENTERTAINMENT.test(request)) return "entertainment";
  return "general-factual";
}

function tokens(value: string) {
  return new Set(value.toLowerCase().replace(/[^a-z0-9\s-]/g, " ").split(/\s+/).filter(x => x.length > 2));
}

function overlap(request: string, candidate: Candidate) {
  const a = tokens(request); const b = tokens(`${candidate.title} ${candidate.snippet || ""}`);
  let hits = 0; a.forEach(x => { if (b.has(x)) hits++; });
  return a.size ? hits / a.size : 0;
}

function bookPurposeStanding(c: Candidate): Determination | null {
  const text = `${c.title} ${c.snippet || ""} ${c.url}`;
  if (!BOOK_EVIDENCE.test(text)) {
    return {state:"DENY",reasonCode:"PURPOSE_BINDING_FAIL",explanation:"The request is for published books, but this candidate does not establish book-level evidence or a book record.",evaluationTier:"T1"};
  }
  if (CLEAR_NON_BOOK_PAGE.test(text) && !/amazon\.|goodreads\.|kindle|ebook|paperback|hardcover|isbn|published works|published a new book|wrote and published/i.test(text)) {
    return {state:"DENY",reasonCode:"PURPOSE_BINDING_FAIL",explanation:"The candidate may match the person or topic, but its page purpose is not sufficiently bound to the request for published books.",evaluationTier:"T1"};
  }
  return null;
}

export function evaluateCandidate(request: string, profile: ASGProfile, c: Candidate): Determination {
  if (c.duplicateOf) return {state:"DENY",reasonCode:"DUPLICATE",explanation:"Equivalent candidate already exists in the preserved provider set.",evaluationTier:"T0"};
  if (VIDEO.test(request) && c.mediaType && !/video/i.test(c.mediaType)) return {state:"DENY",reasonCode:"REL_SCOPE_FAIL",explanation:"Candidate fails the requested media-format binding.",evaluationTier:"T0"};
  const rel = overlap(request,c);
  if (rel === 0) return {state:"DENY",reasonCode:"REL_SCOPE_FAIL",explanation:"Candidate does not establish a sufficient subject binding to the bounded request.",evaluationTier:"T1"};
  if (BOOK_REQUEST.test(request)) {
    const purpose = bookPurposeStanding(c);
    if (purpose) return purpose;
  }
  if (!c.url || !/^https?:\/\//i.test(c.url)) return {state:"HOLD",reasonCode:"PROVENANCE_INSUFFICIENT",explanation:"Candidate identity cannot be sufficiently established from the available provider metadata.",evaluationTier:"T1"};
  if (profile === "high-consequence") return {state:"ESCALATE",reasonCode:"PROFILE_ESCALATION",explanation:"High-consequence delivery requires deeper provenance, corroboration and an elevated review route.",evaluationTier:"T4"};
  if (profile === "current-events" && !c.publishedAt) return {state:"HOLD",reasonCode:"RECENCY_UNESTABLISHED",explanation:"The active profile requires freshness evidence that is not present in the candidate metadata.",evaluationTier:"T2"};
  if ((profile === "research" || profile === "general-factual") && !c.canonicalHost) return {state:"HOLD",reasonCode:"PROVENANCE_INSUFFICIENT",explanation:"Source provenance requires additional evidence before delivery.",evaluationTier:"T2"};
  return {state:"ALLOW",reasonCode:"EVIDENCE_SUFFICIENT",explanation:"Preserved candidate evidence satisfies the active request binding and profile at this evaluation stage.",evaluationTier:profile === "entertainment" ? "T1" : "T2"};
}

export const ASG_ENGINE_VERSION = "asg.v0.2";
export const ASG_PROFILE_VERSION = "profiles.v0.1";
