export type ASGState = "ALLOW" | "HOLD" | "DENY" | "ESCALATE";
export type ASGProfile = "entertainment" | "navigation" | "general-factual" | "current-events" | "high-consequence" | "research";
export type Candidate = { id:string; providerRank:number; title:string; url:string; snippet?:string; mediaType?:string; publishedAt?:string; canonicalHost?:string; duplicateOf?:string; metadata?:Record<string,unknown> };
export type Determination = { state:ASGState; reasonCode:string; explanation:string; evaluationTier:"T0"|"T1"|"T2"|"T3"|"T4" };

const HIGH_CONSEQUENCE=/\b(medical|medicine|diagnosis|dose|dosage|legal advice|lawsuit|investment|financial advice|suicide|self-harm|emergency)\b/i;
const CURRENT=/\b(today|latest|current|breaking|right now|this week)\b/i;
const RESEARCH=/\b(study|research|paper|doi|journal|dataset|report)\b/i;
const VIDEO=/\b(video|watch|youtube|clip)\b/i;
const ENTERTAINMENT=/\b(funny|kitten|kitty|cat|dog|meme|music|movie|trailer)\b/i;
const BOOK_REQUEST=/\b(book|books|published books|bibliography|kindle|isbn)\b/i;
const BOOK_EVIDENCE=/\b(book|books|kindle|ebook|paperback|hardcover|isbn|author of|published works|published a new book|wrote and published)\b/i;
const CANONICAL_BOOK_RECORD=/\b(amazon\.|goodreads\.|books\.google\.|openlibrary\.|worldcat\.|kindle|ebook\/dp\/|paperback|hardcover|isbn)\b/i;
const SUPPORTING_BOOK_EVIDENCE=/\b(published a new book|wrote and published|new book|published works)\b/i;
const CLEAR_NON_BOOK_PAGE=/\b(obituary|license detail|professional profile|linkedin profile|instagram profile|facebook group|article|blog post|hvac industry professional)\b/i;
const REQUEST_NOISE=new Set(["published","books","book","articles","article","works","work","author","by","about","find","show","give","me","the","of","for"]);
const QUESTION_WORDS=new Set(["what","who","where","when","why","how","which","is","are","was","were","does","do","did","explain","define","meaning"]);
const BINDING_NOISE=new Set(["what","who","where","when","why","how","which","is","are","was","were","does","do","did","explain","define","meaning","the","a","an","of","for","to","in","on","and","or","with","about","find","show","give","me"]);

export function classifyProfile(request:string):ASGProfile { if(HIGH_CONSEQUENCE.test(request))return"high-consequence"; if(CURRENT.test(request))return"current-events"; if(RESEARCH.test(request))return"research"; if(ENTERTAINMENT.test(request))return"entertainment"; return"general-factual"; }
function words(value:string){return value.toLowerCase().replace(/[^a-z0-9]+/g," ").split(/\s+/).filter(Boolean)}
function lexeme(value:string){ if(value.length>4&&value.endsWith("ies"))return value.slice(0,-3)+"y"; if(value.length>4&&/(sses|shes|ches|xes|zes)$/.test(value))return value.slice(0,-2); if(value.length>3&&value.endsWith("s")&&!value.endsWith("ss"))return value.slice(0,-1); return value; }
function editDistanceAtMostOne(a:string,b:string){ if(a===b)return true; if(Math.abs(a.length-b.length)>1)return false; let i=0,j=0,d=0; while(i<a.length&&j<b.length){ if(a[i]===b[j]){i++;j++;continue} d++; if(d>1)return false; if(a.length>b.length)i++; else if(b.length>a.length)j++; else{i++;j++;} } if(i<a.length||j<b.length)d++; return d<=1; }
function lexicalEquivalent(a:string,b:string){ const x=lexeme(a),y=lexeme(b); if(x===y)return true; return x.length>=6&&y.length>=6&&editDistanceAtMostOne(x,y); }
function tokens(value:string){return words(value).filter(x=>x.length>2&&!BINDING_NOISE.has(x))}
function bindingCoverage(request:string,c:Candidate){const a=tokens(request),b=tokens(`${c.title} ${c.snippet||""}`);let hits=0;a.forEach(x=>{if(b.some(y=>lexicalEquivalent(x,y)))hits++});return {hits,total:a.length,ratio:a.length?hits/a.length:0};}
function sufficientSubjectBinding(request:string,c:Candidate){const coverage=bindingCoverage(request,c);if(coverage.total===0)return false;if(coverage.total===1)return coverage.hits===1;if(coverage.total===2)return coverage.hits===2;return coverage.ratio>=0.67;}
function requestedIdentity(request:string){ const raw=words(request); if(raw.some(x=>QUESTION_WORDS.has(x)))return null; const parts=raw.filter(x=>x.length>1&&!REQUEST_NOISE.has(x)); if(parts.length<2||parts.length>4)return null; if(BOOK_REQUEST.test(request)||/\b(author|profile|biography|bio|person|people|wrote|written by)\b/i.test(request))return parts; return null; }
function identityStanding(request:string,c:Candidate):Determination|null { const identity=requestedIdentity(request);if(!identity)return null;const set=new Set(words(`${c.title} ${c.snippet||""} ${c.url}`));if(identity.every(x=>set.has(x)))return null;const firstOk=set.has(identity[0]),lastOk=set.has(identity[identity.length-1]);if(firstOk&&lastOk)return{state:"HOLD",reasonCode:"IDENTITY_BINDING_INSUFFICIENT",explanation:"The candidate partially matches the requested person, but the preserved provider evidence does not establish the full requested identity strongly enough for delivery.",evaluationTier:"T1"};return{state:"DENY",reasonCode:"IDENTITY_BINDING_FAIL",explanation:"The candidate does not establish sufficient identity binding to the person named in the bounded request.",evaluationTier:"T1"}; }
function bookPurposeStanding(c:Candidate):Determination|null { const text=`${c.title} ${c.snippet||""} ${c.url}`;if(!BOOK_EVIDENCE.test(text))return{state:"DENY",reasonCode:"PURPOSE_BINDING_FAIL",explanation:"The request is for published books, but this candidate does not establish book-level evidence or a book record.",evaluationTier:"T1"};if(CLEAR_NON_BOOK_PAGE.test(text)&&!CANONICAL_BOOK_RECORD.test(text)&&!SUPPORTING_BOOK_EVIDENCE.test(text))return{state:"DENY",reasonCode:"PURPOSE_BINDING_FAIL",explanation:"The candidate may match the person or topic, but its page purpose is not sufficiently bound to the request for published books.",evaluationTier:"T1"};return null; }
function bookRecordStanding(c:Candidate):Determination|null { const text=`${c.title} ${c.snippet||""} ${c.url}`;if(CANONICAL_BOOK_RECORD.test(text))return null;if(SUPPORTING_BOOK_EVIDENCE.test(text))return{state:"HOLD",reasonCode:"CANONICAL_RECORD_REQUIRED",explanation:"The candidate establishes supporting evidence that a book was published, but the request is for published books and this candidate is not itself a canonical book record or listing.",evaluationTier:"T2"};return null; }

export function evaluateCandidate(request:string,profile:ASGProfile,c:Candidate):Determination {
 if(c.duplicateOf)return{state:"DENY",reasonCode:"DUPLICATE",explanation:"Equivalent candidate already exists in the preserved provider set.",evaluationTier:"T0"};
 if(VIDEO.test(request)&&c.mediaType&&!/video/i.test(c.mediaType))return{state:"DENY",reasonCode:"REL_SCOPE_FAIL",explanation:"Candidate fails the requested media-format binding.",evaluationTier:"T0"};
 if(!sufficientSubjectBinding(request,c))return{state:"DENY",reasonCode:"REL_SCOPE_FAIL",explanation:"Candidate does not establish sufficient bounded coverage of the request's meaningful subject tokens after lexical normalization.",evaluationTier:"T1"};
 if(BOOK_REQUEST.test(request)){const purpose=bookPurposeStanding(c);if(purpose)return purpose;}
 const identity=identityStanding(request,c);if(identity)return identity;
 if(BOOK_REQUEST.test(request)){const record=bookRecordStanding(c);if(record)return record;}
 if(!c.url||!/^https?:\/\//i.test(c.url))return{state:"HOLD",reasonCode:"PROVENANCE_INSUFFICIENT",explanation:"Candidate identity cannot be sufficiently established from the available provider metadata.",evaluationTier:"T1"};
 if(profile==="high-consequence")return{state:"ESCALATE",reasonCode:"PROFILE_ESCALATION",explanation:"High-consequence delivery requires deeper provenance, corroboration and an elevated review route.",evaluationTier:"T4"};
 if(profile==="current-events"&&!c.publishedAt)return{state:"HOLD",reasonCode:"RECENCY_UNESTABLISHED",explanation:"The active profile requires freshness evidence that is not present in the candidate metadata.",evaluationTier:"T2"};
 if((profile==="research"||profile==="general-factual")&&!c.canonicalHost)return{state:"HOLD",reasonCode:"PROVENANCE_INSUFFICIENT",explanation:"Source provenance requires additional evidence before delivery.",evaluationTier:"T2"};
 return{state:"ALLOW",reasonCode:"EVIDENCE_SUFFICIENT",explanation:"Preserved candidate evidence satisfies the active request binding and profile at this evaluation stage.",evaluationTier:profile==="entertainment"?"T1":"T2"};
}
export const ASG_ENGINE_VERSION="asg.v0.7";
export const ASG_PROFILE_VERSION="profiles.v0.1";
