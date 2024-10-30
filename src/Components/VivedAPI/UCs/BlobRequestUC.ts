import { getSingletonComponent, HostAppObject, HostAppObjectRepo, HostAppObjectUC } from "../../../HostAppObject";

export interface RequestBlobOptions {
  headers?: any;
  method: "GET" | "PATCH" | "POST" | "PUT" | "DELETE" | undefined;
  params?: any;
  body?: any;
}

export abstract class BlobRequestUC extends HostAppObjectUC {
  static type = "BlobRequestUC";

  abstract doRequest(url: URL, options?: RequestBlobOptions): Promise<Blob>;

  static get(appObjects: HostAppObjectRepo): BlobRequestUC | undefined {
    return getSingletonComponent(BlobRequestUC.type, appObjects);
  }
}

