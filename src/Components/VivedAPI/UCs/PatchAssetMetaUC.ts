import {
  getSingletonComponent,
  AppObject,
  AppObjectRepo,
  AppObjectUC
} from "@vived/core";
import { VivedAPIEntity } from "../Entities/VivedAPIEntity";
import { JsonRequestUC, RequestJSONOptions } from "./JsonRequestUC";
import { SignedAuthTokenUC } from "./SignedAuthTokenUC";

export interface PatchAssetMetaDTO {
  id: string;
  name: string;
  description: string;
  archived: boolean;
}

export abstract class PatchAssetMetaUC extends AppObjectUC {
  static type = "PatchAssetMetaUC";

  abstract doPatch(data: PatchAssetMetaDTO): Promise<void>;

  static get(appObjects: AppObjectRepo): PatchAssetMetaUC | undefined {
    return getSingletonComponent(PatchAssetMetaUC.type, appObjects);
  }
}

export function makePatchAssetMetaUC(appObject: AppObject): PatchAssetMetaUC {
  return new PatchAssetMetaUCImp(appObject);
}

class PatchAssetMetaUCImp extends PatchAssetMetaUC {
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

  doPatch = (data: PatchAssetMetaDTO): Promise<void> => {
    const getAuthToken = this.getAuthToken;
    const vivedAPI = this.vivedAPI;
    const jsonRequester = this.jsonRequester;

    if (!getAuthToken || !vivedAPI || !jsonRequester) {
      return Promise.reject();
    }

    const { id, name, description, archived } = data;

    return new Promise((resolve, reject) => {
      getAuthToken()
        .then((token) => {
          const postURL = vivedAPI.getEndpointURL(`assets/${id}`);

          const body = {
            name,
            description,
            archived
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

  constructor(appObject: AppObject) {
    super(appObject, PatchAssetMetaUC.type);
    this.appObjects.registerSingleton(this);
  }
}
