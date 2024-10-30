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
