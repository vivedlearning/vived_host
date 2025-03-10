import {
  getSingletonComponent,
  AppObject,
  AppObjectRepo,
  AppObjectUC
} from "@vived/core";

export interface RequestBlobOptions {
  headers?: any;
  method: "GET" | "PATCH" | "POST" | "PUT" | "DELETE" | undefined;
  params?: any;
  body?: any;
}

export abstract class BlobRequestUC extends AppObjectUC {
  static type = "BlobRequestUC";

  abstract doRequest(url: URL, options?: RequestBlobOptions): Promise<Blob>;

  static get(appObjects: AppObjectRepo): BlobRequestUC | undefined {
    return getSingletonComponent(BlobRequestUC.type, appObjects);
  }
}
