export type ReportFingerprint={algorithm:'SHA-256';digest:string;byte_length:number;classification:string};
export function createBrowserReportFingerprint(report:unknown):Promise<ReportFingerprint>;
