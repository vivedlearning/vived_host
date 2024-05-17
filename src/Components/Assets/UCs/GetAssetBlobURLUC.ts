import { getSingletonComponent, HostAppObject, HostAppObjectRepo, HostAppObjectUC } from "../../../HostAppObject";
import { FetchAssetFileFromAPIUC } from "../../VivedAPI";
import { AssetEntity } from "../Entities/AssetEntity";
import { AssetRepo } from "../Entities/AssetRepo";
import { GetAssetUC } from "./GetAssetUC";

export abstract class GetAssetBlobURLUC extends HostAppObjectUC {
  static type = "GetAssetBlobURLUC";

  abstract getAssetBlobURL(assetID: string): Promise<string>;

  static get(appObjects: HostAppObjectRepo): GetAssetBlobURLUC | undefined {
    return getSingletonComponent<GetAssetBlobURLUC>(
      GetAssetBlobURLUC.type,
      appObjects
    );
  }
}

export function makeGetAssetBlobURLUC(
  appObject: HostAppObject
): GetAssetBlobURLUC {
  return new GetAssetBlobURLUCImp(appObject);
}

class GetAssetBlobURLUCImp extends GetAssetBlobURLUC {
  private assetRepo?: AssetRepo;

  private get fetchAssetFile() {
    return this.getCachedSingleton<FetchAssetFileFromAPIUC>(FetchAssetFileFromAPIUC.type)
      ?.doFetch;
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
  }

  constructor(appObject: HostAppObject) {
    super(appObject, GetAssetBlobURLUC.type);

    this.appObjects.registerSingleton(this);

    this.assetRepo = appObject.getComponent<AssetRepo>(AssetRepo.type);
    if (!this.assetRepo) {
      this.error("UC added to an App Object that does not have AssetRepo");
      return;
    }
  }
}
