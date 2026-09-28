/**
 * Read-only evidence port for the Analyzer. Windows come from the governed Recorder store, never from
 * the caller, and are re-verified before use. The Analyzer cannot write to the Recorder.
 */
import type { EvidenceRecorder } from "../recorder";
import type { EvidenceStore } from "../store";
import type { EvidenceWindow } from "../types";

export interface EvidenceReader {
  readWindow(windowId: string): Promise<EvidenceWindow | undefined>;
  listAssetWindowIds(assetId: string): Promise<readonly string[]>;
}

export function recorderEvidenceReader(recorder: Pick<EvidenceRecorder, "getWindow">, store: Pick<EvidenceStore, "listWindowIds">): EvidenceReader {
  return {
    readWindow: (windowId) => recorder.getWindow(windowId),
    listAssetWindowIds: (assetId) => store.listWindowIds(assetId),
  };
}
