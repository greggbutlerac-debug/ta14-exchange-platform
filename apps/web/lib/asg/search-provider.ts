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
  userIp: string;
};

export interface SearchProvider {
  search(query: string, options: SearchProviderOptions): Promise<SearchProviderResult>;
}

type GoogleSearchResult = {
  title?: string;
  htmlTitle?: string;
  displayUrl?: string;
  shortenedDisplayUrl?: string;
  snippet?: string;
  htmlSnippet?: string;
  mimeType?: string;
  fileFormat?: string;
};

type GoogleSearchResponse = {
  searchResults?: GoogleSearchResult[];
  nextPageToken?: string;
};

export class SearchProviderError extends Error {
  constructor(public readonly code: string, public readonly status?: number) {
    super(code);
    this.name = "SearchProviderError";
  }
}

/**
 * Google Web Search Service adapter.
 * Uses Google's documented REST contract and fails closed when credentials,
 * end-user context, or provider evidence are unavailable.
 */
export class GoogleWebSearchServiceAdapter implements SearchProvider {
  async search(query: string, options: SearchProviderOptions): Promise<SearchProviderResult> {
    const request = query.trim();
    const userIp = options.userIp.trim();
    const apiKey = process.env.GOOGLE_WEB_SEARCH_API_KEY;
    const clientId = process.env.GOOGLE_WEB_SEARCH_CLIENT_ID;

    if (!request) throw new SearchProviderError("GOOGLE_WEB_SEARCH_QUERY_REQUIRED");
    if (!userIp) throw new SearchProviderError("GOOGLE_WEB_SEARCH_USER_IP_REQUIRED");
    if (!apiKey || !clientId) {
      throw new SearchProviderError("GOOGLE_WEB_SEARCH_PROVIDER_NOT_CONFIGURED");
    }

    const pageSize = Math.max(1, Math.min(options.limit ?? 10, 10));
    const endpoint = new URL("https://websearchservice.googleapis.com/v1:search");
    endpoint.searchParams.set("searchQuery.query", request);
    endpoint.searchParams.set("clientContext.clientId", clientId);
    endpoint.searchParams.set("userContext.ipAddress", userIp);
    endpoint.searchParams.set("pageSize", String(pageSize));

    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "X-Goog-Api-Key": apiKey,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new SearchProviderError(`GOOGLE_WEB_SEARCH_PROVIDER_ERROR_${response.status}`, response.status);
    }

    let body: GoogleSearchResponse;
    try {
      body = (await response.json()) as GoogleSearchResponse;
    } catch {
      throw new SearchProviderError("GOOGLE_WEB_SEARCH_INVALID_RESPONSE");
    }

    if (!Array.isArray(body.searchResults)) {
      throw new SearchProviderError("GOOGLE_WEB_SEARCH_INVALID_RESPONSE");
    }

    const candidates: SearchCandidate[] = body.searchResults.slice(0, pageSize).map((item, index) => ({
      rank: index + 1,
      title: item.title?.trim() || "Untitled provider result",
      url: item.displayUrl?.trim() || "",
      snippet: item.snippet?.trim() || "",
      displayUrl: item.shortenedDisplayUrl?.trim() || item.displayUrl?.trim(),
      provider: "GOOGLE_WEB_SEARCH_SERVICE",
      providerResultId: `google-wss-${index + 1}`,
    })).filter(candidate => Boolean(candidate.url));

    return {
      provider: "GOOGLE_WEB_SEARCH_SERVICE",
      query: request,
      candidates,
      live: true,
    };
  }
}
