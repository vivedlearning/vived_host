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
