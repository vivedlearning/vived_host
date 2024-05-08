import { getSingletonComponent, HostAppObject, HostAppObjectRepo, HostAppObjectUC } from "../../../HostAppObject";

export interface BasicFetchOptions {
  headers?: any;
  method: "GET" | "PATCH" | "POST" | "PUT" | "DELETE" | undefined;
  params?: any;
  body?: any;
}

export abstract class BasicFetchUC extends HostAppObjectUC {
  static type = "BasicFetchUC";

  abstract doRequest(
    url: URL,
    options?: BasicFetchOptions
  ): Promise<Response>;

  static get(appObjects: HostAppObjectRepo): BasicFetchUC | undefined {
    return getSingletonComponent(BasicFetchUC.type, appObjects);
  }
}

export function makeBasicFetchUC(appObject: HostAppObject): BasicFetchUC {
  return new BasicFetchUCImp(appObject);
}

class BasicFetchUCImp extends BasicFetchUC {
  doRequest = (url: URL, options?: BasicFetchOptions): Promise<Response> => {
    return new Promise<Response>((resolve, reject) => {
      fetch(url.href, options)
        .then((resp) => {
          if (!resp.ok) {
            reject(new Error(`Response is not OK: ${resp}`));
          }
          resolve(resp);
        })
        .catch((e) => {
          reject(e);
        });
    });
  };

  constructor(appObject: HostAppObject) {
    super(appObject, BasicFetchUC.type);
    this.appObjects.registerSingleton(this);
  }
}
