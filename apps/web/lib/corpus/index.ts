import records from "./zenodo-records.json";

export type CorpusAccess = "open" | "restricted";
export type CorpusRecord = {
  id: string;
  title: string;
  publishedAt: string;
  access: CorpusAccess;
  doi: string | null;
  localArchiveStatus: "metadata-only";
  source: string;
};

const corpusRecords = records as CorpusRecord[];

/**
 * Metadata-only listing. NEVER add restricted PDF text or private object URLs
 * to this public metadata collection.
 */
export function listCorpusMetadata(options?: {
  query?: string;
  access?: CorpusAccess;
}): CorpusRecord[] {
  const query = options?.query?.trim().toLocaleLowerCase() ?? "";
  return corpusRecords.filter((record) => {
    if (options?.access && record.access !== options.access) return false;
    if (!query) return true;
    return [record.id, record.title, record.doi ?? ""]
      .some((field) => field.toLocaleLowerCase().includes(query));
  });
}

export function getCorpusMetadata(id: string): CorpusRecord | undefined {
  return corpusRecords.find((record) => record.id === id);
}
