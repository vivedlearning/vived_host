import {
  getSingletonComponent,
  AppObject,
  AppObjectRepo,
  AppObjectUC
} from "@vived/core";
import { VivedAPIEntity } from "../Entities/VivedAPIEntity";
import { JsonRequestUC, RequestJSONOptions } from "./JsonRequestUC";
import { SignedAuthTokenUC } from "./SignedAuthTokenUC";

export interface GetAppResponseDTO {
  interfaceVersion: string;
  assetFolderURL: string;
  entrypoints: string[];
}

export abstract class GetAppFromAPIUC extends AppObjectUC {
  static type = "GetAppFromAPIUC";

  abstract getApp(appID: string, version: string): Promise<GetAppResponseDTO>;

  static get(appObjects: AppObjectRepo): GetAppFromAPIUC | undefined {
    return getSingletonComponent(GetAppFromAPIUC.type, appObjects);
  }
}

export function makeGetAppFromAPIUC(appObject: AppObject): GetAppFromAPIUC {
  return new GetAppUCImp(appObject);
}

class GetAppUCImp extends GetAppFromAPIUC {
  private get jsonRequester() {
    return this.getCachedSingleton<JsonRequestUC>(JsonRequestUC.type)
      ?.doRequest;
  }

  private get getAuthToken() {
    return this.getCachedSingleton<SignedAuthTokenUC>(SignedAuthTokenUC.type)
      ?.getAuthToken;
  }

  private get vivedAPI() {
    return this.getCachedSingleton<VivedAPIEntity>(VivedAPIEntity.type);
  }

  getApp = (appID: string, version: string): Promise<GetAppResponseDTO> => {
    const getAuthToken = this.getAuthToken;
    const vivedAPI = this.vivedAPI;
    const jsonRequester = this.jsonRequester;

    if (!getAuthToken || !vivedAPI || !jsonRequester) {
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      getAuthToken()
        .then((token) => {
          const endpointURL = vivedAPI.getEndpointURL(
            `apps/${appID}/${version}`
          );
          endpointURL.searchParams.set("function_version", "2");

          const options: RequestJSONOptions = {
            method: "GET",
            headers: {
              Authorization: "Bearer " + token
            }
          };

          return jsonRequester(endpointURL, options);
        })
        .then((resp: GetAppResponse) => {
          const app = resp.app;

          const appDTO: GetAppResponseDTO = {
            interfaceVersion: app.appInterfaceVersion,
            assetFolderURL: app.baseAssetsUrl,
            entrypoints: [...app.files]
          };

          resolve(appDTO);
        })
        .catch((e) => {
          reject(e);
          return;
        });
    });
  };

  constructor(appObject: AppObject) {
    super(appObject, GetAppFromAPIUC.type);
    this.appObjects.registerSingleton(this);
  }
}

export interface GetAppResponse {
  app: App;
}

export interface App {
  PK: string;
  SK: string;
  title?: string;
  description?: string;
  image?: string;
  versions: string[];
  files: string[];
  mount_app: string;
  mount_name: string;
  appInterfaceVersion: string;
  baseAssetsUrl: string;
}
