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

export interface SearchProvider {
  search(query: string, limit?: number): Promise<SearchProviderResult>;
}

/**
 * Google Web Search Service adapter.
 * Requires legitimate Google partner credentials. It intentionally fails closed
 * when credentials are absent; ASG must never fabricate provider candidates.
 */
export class GoogleWebSearchServiceAdapter implements SearchProvider {
  async search(query: string, limit = 10): Promise<SearchProviderResult> {
    const apiKey = process.env.GOOGLE_WEB_SEARCH_API_KEY;
    const clientId = process.env.GOOGLE_WEB_SEARCH_CLIENT_ID;

    if (!apiKey || !clientId) {
      throw new Error("GOOGLE_WEB_SEARCH_PROVIDER_NOT_CONFIGURED");
    }

    const pageSize = Math.max(1, Math.min(limit, 10));
    const endpoint = new URL("https://websearchservice.googleapis.com/v1:search");
    endpoint.searchParams.set("query", query);
    endpoint.searchParams.set("pageSize", String(pageSize));
    endpoint.searchParams.set("client_id", clientId);
    endpoint.searchParams.set("key", apiKey);

    const response = await fetch(endpoint, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`GOOGLE_WEB_SEARCH_PROVIDER_ERROR_${response.status}`);
    }

    const body: any = await response.json();
    const raw = body.results || body.searchResults || body.items || [];
    const candidates: SearchCandidate[] = raw.slice(0, pageSize).map((item: any, index: number) => ({
      rank: index + 1,
      title: item.title || item.name || "Untitled provider result",
      url: item.url || item.link || item.uri || "",
      snippet: item.snippet || item.description || "",
      displayUrl: item.displayUrl || item.displayLink,
      provider: "GOOGLE_WEB_SEARCH_SERVICE",
      providerResultId: item.id || item.resultId,
    })).filter((candidate: SearchCandidate) => Boolean(candidate.url));

    return {
      provider: "GOOGLE_WEB_SEARCH_SERVICE",
      query,
      candidates,
      live: true,
    };
  }
}
