export type SearchCandidate = {
  rank: number;
  title: string;
  url: string;
  snippet: string;
  displayUrl?: string;
  provider: string;
  providerResultId?: string;
};

export type SearchProviderResult = {
  provider: string;
  query: string;
  candidates: SearchCandidate[];
  live: boolean;
};

export type SearchProviderOptions = {
  limit?: number;
  userIp?: string;
};

export interface SearchProvider {
  search(query: string, options?: SearchProviderOptions): Promise<SearchProviderResult>;
}

export class SearchProviderError extends Error {
  constructor(
    public readonly code: string,
    public readonly status?: number,
    public readonly detail?: string,
  ) {
    super(code);
    this.name = "SearchProviderError";
  }
}

function sanitizeProviderDetail(value: string): string | undefined {
  const compact = value.replace(/\s+/g, " ").trim();
  if (!compact) return undefined;
  // Provider diagnostics only: cap length and redact common credential-bearing fields.
  return compact
    .replace(/("?(?:api[-_ ]?key|token|authorization)"?\s*[:=]\s*")([^"]+)(")/gi, "$1[REDACTED]$3")
    .replace(/(bearer\s+)[A-Za-z0-9._~+\/-]+/gi, "$1[REDACTED]")
    .slice(0, 500);
}

type SerperOrganicResult = {
  title?: string;
  link?: string;
  snippet?: string;
  position?: number;
};

type SerperResponse = {
  organic?: SerperOrganicResult[];
};

/**
 * Default ASG demonstrator provider. Serper is only the transport used to
 * retrieve live Google search results. TA-14 governance begins after the
 * provider candidate set is returned and frozen.
 */
export class SerperGoogleSearchAdapter implements SearchProvider {
  async search(query: string, options: SearchProviderOptions = {}): Promise<SearchProviderResult> {
    const request = query.trim();
    const apiKey = process.env.SERPER_API_KEY;
    if (!request) throw new SearchProviderError("SEARCH_QUERY_REQUIRED");
    if (!apiKey) throw new SearchProviderError("SEARCH_PROVIDER_NOT_CONFIGURED");

    const limit = Math.max(1, Math.min(options.limit ?? 10, 10));
    const response = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: {"X-API-KEY": apiKey, "Content-Type": "application/json"},
      body: JSON.stringify({q: request, num: limit}),
      cache: "no-store",
    });
    if (!response.ok) {
      let detail: string | undefined;
      try { detail = sanitizeProviderDetail(await response.text()); }
      catch { detail = undefined; }
      throw new SearchProviderError(`SEARCH_PROVIDER_ERROR_${response.status}`, response.status, detail);
    }

    let body: SerperResponse;
    try { body = (await response.json()) as SerperResponse; }
    catch { throw new SearchProviderError("SEARCH_PROVIDER_INVALID_RESPONSE"); }
    if (!Array.isArray(body.organic)) throw new SearchProviderError("SEARCH_PROVIDER_INVALID_RESPONSE");

    const candidates = body.organic.slice(0, limit).map((item, index) => ({
      rank: item.position ?? index + 1,
      title: item.title?.trim() || "Untitled Google result",
      url: item.link?.trim() || "",
      snippet: item.snippet?.trim() || "",
      displayUrl: item.link?.trim(),
      provider: "GOOGLE_VIA_SERPER",
      providerResultId: `google-serper-${item.position ?? index + 1}`,
    })).filter(candidate => Boolean(candidate.url));

    return {provider:"GOOGLE_VIA_SERPER", query:request, candidates, live:true};
  }
}

/** Optional future direct Google WSS adapter; not required by the ASG demonstrator. */
export class GoogleWebSearchServiceAdapter implements SearchProvider {
  async search(query: string, options: SearchProviderOptions = {}): Promise<SearchProviderResult> {
    const request=query.trim();
    const userIp=(options.userIp||"").trim();
    const apiKey=process.env.GOOGLE_WEB_SEARCH_API_KEY;
    const clientId=process.env.GOOGLE_WEB_SEARCH_CLIENT_ID;
    if(!request)throw new SearchProviderError("GOOGLE_WEB_SEARCH_QUERY_REQUIRED");
    if(!userIp)throw new SearchProviderError("GOOGLE_WEB_SEARCH_USER_IP_REQUIRED");
    if(!apiKey||!clientId)throw new SearchProviderError("GOOGLE_WEB_SEARCH_PROVIDER_NOT_CONFIGURED");
    const pageSize=Math.max(1,Math.min(options.limit??10,10));
    const endpoint=new URL("https://websearchservice.googleapis.com/v1:search");
    endpoint.searchParams.set("searchQuery.query",request);
    endpoint.searchParams.set("clientContext.clientId",clientId);
    endpoint.searchParams.set("userContext.ipAddress",userIp);
    endpoint.searchParams.set("pageSize",String(pageSize));
    const response=await fetch(endpoint,{method:"GET",headers:{Accept:"application/json","X-Goog-Api-Key":apiKey},cache:"no-store"});
    if(!response.ok)throw new SearchProviderError(`GOOGLE_WEB_SEARCH_PROVIDER_ERROR_${response.status}`,response.status);
    const body:any=await response.json();
    if(!Array.isArray(body.searchResults))throw new SearchProviderError("GOOGLE_WEB_SEARCH_INVALID_RESPONSE");
    const candidates=body.searchResults.slice(0,pageSize).map((item:any,index:number)=>({rank:index+1,title:item.title?.trim()||"Untitled provider result",url:item.displayUrl?.trim()||"",snippet:item.snippet?.trim()||"",displayUrl:item.shortenedDisplayUrl?.trim()||item.displayUrl?.trim(),provider:"GOOGLE_WEB_SEARCH_SERVICE",providerResultId:`google-wss-${index+1}`})).filter((candidate:SearchCandidate)=>Boolean(candidate.url));
    return {provider:"GOOGLE_WEB_SEARCH_SERVICE",query:request,candidates,live:true};
  }
}
