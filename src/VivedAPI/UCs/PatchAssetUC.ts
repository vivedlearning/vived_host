import {
  AppObject,
  AppObjectRepo,
  AppObjectUC,
  generateUniqueID,
  getSingletonComponent
} from "@vived/core";
import { VivedAPIEntity } from "../Entities/VivedAPIEntity";
import { FileUploadUC } from "./FileUploadUC";
import { JsonRequestUC, RequestJSONOptions } from "./JsonRequestUC";
import { SignedAuthTokenUC } from "./SignedAuthTokenUC";

export interface PatchAssetDTO {
  id: string;
  name: string;
  description: string;
  archived: boolean;
  file: File;
}

interface PatchParam {
  name: string;
  description: string;
  archived: boolean;
  filename: string;
}

export abstract class PatchAssetUC extends AppObjectUC {
  static type = "PatchAssetUC";

  abstract doPatch(data: PatchAssetDTO): Promise<void>;

  static get(appObjects: AppObjectRepo): PatchAssetUC | undefined {
    return getSingletonComponent(PatchAssetUC.type, appObjects);
  }
}

export function makePatchAssetUC(appObject: AppObject): PatchAssetUC {
  return new PatchAssetUCImp(appObject);
}

class PatchAssetUCImp extends PatchAssetUC {
  private get jsonRequester() {
    return this.getCachedSingleton<JsonRequestUC>(JsonRequestUC.type)
      ?.doRequest;
  }

  private get getAuthToken() {
    return this.getCachedSingleton<SignedAuthTokenUC>(SignedAuthTokenUC.type)
      ?.getAuthToken;
  }

  private get fileUpload() {
    return this.getCachedSingleton<FileUploadUC>(FileUploadUC.type)?.doUpload;
  }

  private get vivedAPI() {
    return this.getCachedSingleton<VivedAPIEntity>(VivedAPIEntity.type);
  }

  doPatch = (data: PatchAssetDTO): Promise<void> => {
    const getAuthToken = this.getAuthToken;
    const vivedAPI = this.vivedAPI;
    const jsonRequester = this.jsonRequester;
    const fileUpload = this.fileUpload;

    if (!getAuthToken || !vivedAPI || !jsonRequester || !fileUpload) {
      return Promise.reject();
    }

    const { id, file, name, description, archived } = data;

    let extension: string = "";
    const strArr = file.name.split(".");
    extension = strArr[strArr.length - 1];
    const filename = `${generateUniqueID()}.${extension}`;

    const assetFile = new File([file], `${filename}`, {
      lastModified: Date.now()
    });

    return new Promise((resolve, reject) => {
      fileUpload(assetFile)
        .then((_) => {
          return getAuthToken();
        })
        .then((token) => {
          const url = vivedAPI.getEndpointURL(`assets/${id}`);
          const body: PatchParam = {
            archived,
            description,
            filename,
            name
          };

          const options: RequestJSONOptions = {
            method: "PATCH",
            body: JSON.stringify(body),
            headers: {
              Authorization: "Bearer " + token
            }
          };

          return jsonRequester(url, options);
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
    super(appObject, PatchAssetUC.type);
    this.appObjects.registerSingleton(this);
  }
}
