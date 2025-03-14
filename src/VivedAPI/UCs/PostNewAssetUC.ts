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

export interface NewAssetApiDto {
  name: string;
  description: string;
  ownerID: string;
  file: File;
}

export interface NewAssetResponseDTO {
  id: string;
  filename: string;
}

export abstract class PostNewAssetUC extends AppObjectUC {
  static type = "PostNewAssetUC";

  abstract doPost(data: NewAssetApiDto): Promise<NewAssetResponseDTO>;

  static get(appObjects: AppObjectRepo): PostNewAssetUC | undefined {
    return getSingletonComponent(PostNewAssetUC.type, appObjects);
  }
}

export function makePostNewAssetUC(appObject: AppObject): PostNewAssetUC {
  return new PostNewAssetUCImp(appObject);
}

class PostNewAssetUCImp extends PostNewAssetUC {
  private get jsonRequester() {
    return this.getCachedSingleton<JsonRequestUC>(JsonRequestUC.type)
      ?.doRequest;
  }

  private get getPlayerAuthToken() {
    return this.getCachedSingleton<SignedAuthTokenUC>(SignedAuthTokenUC.type)
      ?.getAuthToken;
  }

  private get fileUploader() {
    return this.getCachedSingleton<FileUploadUC>(FileUploadUC.type)?.doUpload;
  }

  private get vivedAPI() {
    return this.getCachedSingleton<VivedAPIEntity>(VivedAPIEntity.type);
  }

  doPost = (data: NewAssetApiDto): Promise<NewAssetResponseDTO> => {
    const fileUploader = this.fileUploader;
    const getPlayerAuthToken = this.getPlayerAuthToken;
    const vivedAPI = this.vivedAPI;
    const jsonRequester = this.jsonRequester;

    if (!fileUploader || !getPlayerAuthToken || !vivedAPI || !jsonRequester) {
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      const { description, file, name, ownerID } = data;
      let assetId: string;

      const nameSplits = file.name.split(".");
      const extension = nameSplits[nameSplits.length - 1];
      const filename = `${generateUniqueID()}.${extension}`;
      const assetFile = new File([file], filename, {
        lastModified: Date.now()
      });

      fileUploader(assetFile)
        .then((_) => {
          return getPlayerAuthToken();
        })
        .then((token) => {
          const postURL = vivedAPI.getEndpointURL("assets");

          const body = {
            ownerId: ownerID,
            name,
            description,
            filename
          };

          const options: RequestJSONOptions = {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
              Authorization: "Bearer " + token
            }
          };

          return jsonRequester(postURL, options);
        })
        .then((result) => {
          assetId = result.assetId;
          resolve({
            id: assetId,
            filename
          });
        })
        .catch((e) => {
          reject(e);
          return;
        });
    });
  };

  constructor(appObject: AppObject) {
    super(appObject, PostNewAssetUC.type);
    this.appObjects.registerSingleton(this);
  }
}
