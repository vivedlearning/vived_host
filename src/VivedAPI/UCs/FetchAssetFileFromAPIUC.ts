import {
  getSingletonComponent,
  AppObject,
  AppObjectRepo,
  AppObjectUC
} from "@vived/core";
import { AssetEntity } from "../../Assets";
import { BlobRequestUC } from "./BlobRequestUC";

export abstract class FetchAssetFileFromAPIUC extends AppObjectUC {
  static type = "FetchAssetFileFromAPIUC";

  abstract doFetch(asset: AssetEntity): Promise<File>;

  static get(appObjects: AppObjectRepo): FetchAssetFileFromAPIUC | undefined {
    return getSingletonComponent(FetchAssetFileFromAPIUC.type, appObjects);
  }
}

export function makeFetchAssetFileFromAPIUC(
  appObject: AppObject
): FetchAssetFileFromAPIUC {
  return new FetchAssetFileUCImp(appObject);
}

class FetchAssetFileUCImp extends FetchAssetFileFromAPIUC {
  private get requestBlob() {
    return this.getCachedSingleton<BlobRequestUC>(BlobRequestUC.type)
      ?.doRequest;
  }

  doFetch = (asset: AssetEntity): Promise<File> => {
    const requestBlob = this.requestBlob;
    if (!requestBlob) {
      return Promise.reject();
    }

    if (!asset.fileURL) {
      return Promise.reject(new Error(`${asset.id} does not have a file URL`));
    }

    if (!asset.filename) {
      return Promise.reject(new Error(`${asset.id} does not have a filename`));
    }

    return new Promise((resolve, reject) => {
      const filename = asset.filename;
      const url = new URL(asset.fileURL);

      requestBlob(url)
        .then((blob) => {
          if (blob && filename) {
            const file = new File([blob], filename);
            resolve(file);
          }
        })
        .catch((e: Error) => {
          this.warn(e.message);
          reject(e);
        });
    });
  };

  constructor(appObject: AppObject) {
    super(appObject, FetchAssetFileFromAPIUC.type);
    this.appObjects.registerSingleton(this);
  }
}
