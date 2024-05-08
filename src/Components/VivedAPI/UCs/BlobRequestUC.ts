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

export function makeBlobRequestUC(appObject: HostAppObject): BlobRequestUC {
  return new BlobRequestUCImp(appObject);
}

class BlobRequestUCImp extends BlobRequestUC {
  doRequest = (url: URL, options?: RequestBlobOptions): Promise<Blob> => {
    return new Promise<Blob>((resolve, reject) => {
      fetch(url.href, options)
        .then((resp) => {
          if (!resp.ok) {
            reject(new Error(`Response is not OK: ${JSON.stringify(resp)}`));
          }
          return resp.blob();
        })
        .then((blob) => {
          resolve(blob);
        })
        .catch((e) => {
          reject(e);
        });
    });
  };

  constructor(appObject: HostAppObject) {
    super(appObject, BlobRequestUC.type);
    this.appObjects.registerSingleton(this);
  }
}
