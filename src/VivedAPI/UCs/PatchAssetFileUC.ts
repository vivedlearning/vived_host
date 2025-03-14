import {
  getSingletonComponent,
  AppObject,
  AppObjectRepo,
  AppObjectUC
} from "@vived/core";
import { generateUniqueID } from "@vived/core";
import { VivedAPIEntity } from "../Entities/VivedAPIEntity";
import { FileUploadUC } from "./FileUploadUC";
import { JsonRequestUC, RequestJSONOptions } from "./JsonRequestUC";
import { SignedAuthTokenUC } from "./SignedAuthTokenUC";

export abstract class PatchAssetFileUC extends AppObjectUC {
  static type = "PatchAssetFileUC";

  abstract doPatch(assetId: string, file: File): Promise<string>;

  static get(appObjects: AppObjectRepo): PatchAssetFileUC | undefined {
    return getSingletonComponent(PatchAssetFileUC.type, appObjects);
  }
}

export function makePatchAssetFileUC(appObject: AppObject): PatchAssetFileUC {
  return new PatchAssetFileUCImp(appObject);
}

class PatchAssetFileUCImp extends PatchAssetFileUC {
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

  doPatch = (assetId: string, file: File): Promise<string> => {
    const getAuthToken = this.getAuthToken;
    const vivedAPI = this.vivedAPI;
    const jsonRequester = this.jsonRequester;
    const fileUpload = this.fileUpload;

    if (!getAuthToken || !vivedAPI || !jsonRequester || !fileUpload) {
      return Promise.reject();
    }

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
          const url = vivedAPI.getEndpointURL(`assets/${assetId}`);
          const body = {
            filename
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
          resolve(filename);
        })
        .catch((e) => {
          reject(e);
          return;
        });
    });
  };

  constructor(appObject: AppObject) {
    super(appObject, PatchAssetFileUC.type);
    this.appObjects.registerSingleton(this);
  }
}
