import {
  getSingletonComponent,
  AppObject,
  AppObjectRepo,
  AppObjectUC
} from "@vived/core";

export interface RequestJSONOptions {
  headers?: any;
  method: "GET" | "PATCH" | "POST" | "PUT" | "DELETE" | undefined;
  params?: any;
  body?: any;
}

export abstract class JsonRequestUC extends AppObjectUC {
  static type = "JsonRequestUC";

  abstract doRequest(url: URL, options?: RequestJSONOptions): Promise<any>;

  static get(appObjects: AppObjectRepo): JsonRequestUC | undefined {
    return getSingletonComponent(JsonRequestUC.type, appObjects);
  }
}
