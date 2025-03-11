import {
  getSingletonComponent,
  AppObject,
  AppObjectRepo,
  AppObjectUC
} from "@vived/core";

export interface BasicFetchOptions {
  headers?: any;
  method: "GET" | "PATCH" | "POST" | "PUT" | "DELETE" | undefined;
  params?: any;
  body?: any;
}

export abstract class BasicFetchUC extends AppObjectUC {
  static type = "BasicFetchUC";

  abstract doRequest(url: URL, options?: BasicFetchOptions): Promise<Response>;

  static get(appObjects: AppObjectRepo): BasicFetchUC | undefined {
    return getSingletonComponent(BasicFetchUC.type, appObjects);
  }
}
