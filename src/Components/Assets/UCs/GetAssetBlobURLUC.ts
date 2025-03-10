import {
  getSingletonComponent,
  AppObject,
  AppObjectRepo,
  AppObjectUC
} from "@vived/core";
import { FetchAssetFileFromAPIUC } from "../../VivedAPI";
import { AssetEntity } from "../Entities/AssetEntity";
import { AssetRepo } from "../Entities/AssetRepo";
import { GetAssetUC } from "./GetAssetUC";

export abstract class GetAssetBlobURLUC extends AppObjectUC {
  static type = "GetAssetBlobURLUC";

  abstract getAssetBlobURL(assetID: string): Promise<string>;

  static get(appObjects: AppObjectRepo): GetAssetBlobURLUC | undefined {
    return getSingletonComponent<GetAssetBlobURLUC>(
      GetAssetBlobURLUC.type,
      appObjects
    );
  }
}

export function makeGetAssetBlobURLUC(appObject: AppObject): GetAssetBlobURLUC {
  return new GetAssetBlobURLUCImp(appObject);
}

class GetAssetBlobURLUCImp extends GetAssetBlobURLUC {
  private assetRepo?: AssetRepo;

  private get fetchAssetFile() {
    return this.getCachedSingleton<FetchAssetFileFromAPIUC>(
      FetchAssetFileFromAPIUC.type
    )?.doFetch;
  }

  private get getAsset() {
    return this.getCachedSingleton<GetAssetUC>(GetAssetUC.type)?.getAsset;
  }

  getAssetBlobURL = (assetID: string): Promise<string> => {
    const assetRepo = this.assetRepo;
    const getAsset = this.getAsset;
    const fetchAssetFile = this.fetchAssetFile;

    if (!assetRepo || !getAsset || !fetchAssetFile) {
      return Promise.reject();
    }

    const existing = assetRepo.get(assetID);
    if (existing && existing.blobURL) {
      return Promise.resolve(existing.blobURL);
    }

    return new Promise((resolve, reject) => {
      let fetchedAsset: AssetEntity | undefined;

      getAsset(assetID)
        .then((asset) => {
          asset.isFetchingFile = true;
          asset.fetchError = undefined;
          fetchedAsset = asset;
          return fetchAssetFile(asset);
        })
        .then((file) => {
          if (fetchedAsset) {
            fetchedAsset.setFile(file);
            fetchedAsset.isFetchingFile = false;

            if (fetchedAsset.blobURL) {
              resolve(fetchedAsset.blobURL);
              return;
            }
          }
          reject(new Error("Blob URL is empty"));
        })
        .catch((e: Error) => {
          if (fetchedAsset) {
            fetchedAsset.fetchError = e;
            fetchedAsset.isFetchingFile = false;
          }
          reject(e);
        });
    });
  };

  constructor(appObject: AppObject) {
    super(appObject, GetAssetBlobURLUC.type);

    this.appObjects.registerSingleton(this);

    this.assetRepo = appObject.getComponent<AssetRepo>(AssetRepo.type);
    if (!this.assetRepo) {
      this.error("UC added to an App Object that does not have AssetRepo");
      return;
    }
  }
}
