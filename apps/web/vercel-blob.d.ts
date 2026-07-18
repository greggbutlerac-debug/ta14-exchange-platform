declare module "@vercel/blob" {
  export type PutBody =
    | string
    | ArrayBuffer
    | Blob
    | Buffer
    | ReadableStream
    | NodeJS.ReadableStream;

  export interface PutCommandOptions {
    access?: "public";
    addRandomSuffix?: boolean;
    allowOverwrite?: boolean;
    cacheControlMaxAge?: number;
    contentType?: string;
    token?: string;
  }

  export interface PutBlobResult {
    url: string;
    downloadUrl: string;
    pathname: string;
    contentType?: string;
    contentDisposition?: string;
  }

  export interface GetCommandOptions {
    access?: "public";
    token?: string;
    ifNoneMatch?: string;
  }

  export interface GetBlobResult {
    stream: ReadableStream;
    blob: Blob;
    statusCode: number;
    contentType?: string;
    contentLength?: number;
    etag?: string;
  }

  export function put(
    pathname: string,
    body: PutBody,
    options?: PutCommandOptions
  ): Promise<PutBlobResult>;

  export function get(
    urlOrPathname: string,
    options?: GetCommandOptions
  ): Promise<GetBlobResult | null>;
}
