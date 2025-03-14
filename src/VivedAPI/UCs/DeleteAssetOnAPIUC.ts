import {
  getSingletonComponent,
  AppObject,
  AppObjectRepo,
  AppObjectUC
} from "@vived/core";
import { VivedAPIEntity } from "../Entities/VivedAPIEntity";
import { JsonRequestUC, RequestJSONOptions } from "./JsonRequestUC";
import { SignedAuthTokenUC } from "./SignedAuthTokenUC";

export abstract class DeleteAssetOnAPIUC extends AppObjectUC {
  static type = "DeleteAssetOnAPIUC";

  abstract doDelete(assetID: string): Promise<void>;

  static get(appObjects: AppObjectRepo): DeleteAssetOnAPIUC | undefined {
    return getSingletonComponent(DeleteAssetOnAPIUC.type, appObjects);
  }
}

export function makeDeleteAssetOnAPIUC(
  appObject: AppObject
): DeleteAssetOnAPIUC {
  return new DeleteAssetUCImp(appObject);
}

class DeleteAssetUCImp extends DeleteAssetOnAPIUC {
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

  doDelete = (assetID: string): Promise<void> => {
    const getAuthToken = this.getAuthToken;
    const vivedAPI = this.vivedAPI;
    const jsonRequester = this.jsonRequester;

    if (!getAuthToken || !vivedAPI || !jsonRequester) {
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      getAuthToken()
        .then((token) => {
          const postURL = vivedAPI.getEndpointURL(`assets/${assetID}`);

          const options: RequestJSONOptions = {
            method: "DELETE",
            headers: {
              Authorization: "Bearer " + token
            }
          };

          return jsonRequester(postURL, options);
        })
        .then((_) => {
          resolve();
        })
        .catch((e) => {
          reject(e);
          return;
        });
    });
  };

  constructor(appObject: AppObject) {
    super(appObject, DeleteAssetOnAPIUC.type);
    this.appObjects.registerSingleton(this);
  }
}
