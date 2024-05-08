import { getSingletonComponent, HostAppObject, HostAppObjectRepo, HostAppObjectUC } from "../../../HostAppObject";

export interface RequestJSONOptions {
  headers?: any;
  method: "GET" | "PATCH" | "POST" | "PUT" | "DELETE" | undefined;
  params?: any;
  body?: any;
}

export abstract class JsonRequestUC extends HostAppObjectUC {
  static type = "JsonRequestUC";

  abstract doRequest(url: URL, options?: RequestJSONOptions): Promise<any>;

  static get(appObjects: HostAppObjectRepo): JsonRequestUC | undefined {
    return getSingletonComponent(JsonRequestUC.type, appObjects);
  }
}

export function makeJsonRequestUC(appObject: HostAppObject): JsonRequestUC {
  return new JsonRequestUCImp(appObject);
}

class JsonRequestUCImp extends JsonRequestUC {
  doRequest = (url: URL, options?: RequestJSONOptions): Promise<any> => {
    return new Promise<any>((resolve, reject) => {
      fetch(url.href, options)
        .then(async (resp) => {
          if (!resp.ok) {
            this.warn(`Response is not OK: ${resp}`);
            reject(new Error(`Response is not OK: ${resp}`));
          }
          return resp.json();
        })
        .then((json) => {
          resolve(json);
        })
        .catch((e: Error) => {
          this.warn(e.message);
          reject(e);
        });
    });
  }

  constructor(appObject: HostAppObject) {
    super(appObject, JsonRequestUC.type);
    this.appObjects.registerSingleton(this);
  }
}
