import { getSingletonComponent, HostAppObject, HostAppObjectRepo, HostAppObjectUC } from "../../../HostAppObject";
import { VivedAPIEntity } from "../Entities/VivedAPIEntity";
import { JsonRequestUC, RequestJSONOptions } from "./JsonRequestUC";
import { SignedAuthTokenUC } from "./SignedAuthTokenUC";

export abstract class PatchAssetIsArchivedUC extends HostAppObjectUC {
  static type = "PatchAssetIsArchivedUC";

  abstract doPatch(assetID: string, isArchived: boolean): Promise<void>;

  static get(
    appObjects: HostAppObjectRepo
  ): PatchAssetIsArchivedUC | undefined {
    return getSingletonComponent(PatchAssetIsArchivedUC.type, appObjects);
  }
}

export function makePatchAssetIsArchivedUC(
  appObject: HostAppObject
): PatchAssetIsArchivedUC {
  return new PatchAssetIsArchivedUCImp(appObject);
}

class PatchAssetIsArchivedUCImp extends PatchAssetIsArchivedUC {
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

  doPatch = (assetID: string, isArchived: boolean): Promise<void> => {
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

          const body = {
            archived: isArchived
          };

          const options: RequestJSONOptions = {
            method: "PATCH",
            body: JSON.stringify(body),
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
    super(appObject, PatchAssetIsArchivedUC.type);
    this.appObjects.registerSingleton(this);
  }
}
