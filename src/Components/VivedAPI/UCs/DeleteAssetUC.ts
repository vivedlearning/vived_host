import { getSingletonComponent, HostAppObject, HostAppObjectRepo, HostAppObjectUC } from "../../../HostAppObject";
import { VivedAPIEntity } from "../Entities/VivedAPIEntity";
import { JsonRequestUC, RequestJSONOptions } from "./JsonRequestUC";
import { SignedAuthTokenUC } from "./SignedAuthTokenUC";

export abstract class DeleteAssetUC extends HostAppObjectUC {
  static type = "DeleteAssetUC";

  abstract doDelete(assetID: string): Promise<void>;

  static get(appObjects: HostAppObjectRepo): DeleteAssetUC | undefined {
    return getSingletonComponent(DeleteAssetUC.type, appObjects);
  }
}

export function makeDeleteAssetUC(appObject: HostAppObject): DeleteAssetUC {
  return new DeleteAssetUCImp(appObject);
}

class DeleteAssetUCImp extends DeleteAssetUC {
  private get jsonRequester() {
    return this.getCachedSingleton<JsonRequestUC>(JsonRequestUC.type)
      ?.doRequest;
  }

  private get getAuthToken() {
    return this.getCachedSingleton<SignedAuthTokenUC>(SignedAuthTokenUC.type)
      ?.getUserAuthToken;
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

  constructor(appObject: HostAppObject) {
    super(appObject, DeleteAssetUC.type);
    this.appObjects.registerSingleton(this);
  }
}
