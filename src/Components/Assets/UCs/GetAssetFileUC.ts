import { getSingletonComponent, HostAppObject, HostAppObjectRepo, HostAppObjectUC } from "../../../HostAppObject";
import { FetchAssetFileFromAPIUC } from "../../VivedAPI";
import { AssetEntity } from "../Entities/AssetEntity";
import { AssetRepo } from "../Entities/AssetRepo";
import { GetAssetUC } from "./GetAssetUC";

export abstract class GetAssetFileUC extends HostAppObjectUC {
  static type = "GetAssetFileUC";

  abstract getAssetFile(assetID: string): Promise<File>;

  static get(appObjects: HostAppObjectRepo): GetAssetFileUC | undefined {
    return getSingletonComponent<GetAssetFileUC>(
      GetAssetFileUC.type,
      appObjects
    );
  }
}

export function makeGetAssetFileUC(appObject: HostAppObject): GetAssetFileUC {
  return new GetAssetFileUCImp(appObject);
}

class GetAssetFileUCImp extends GetAssetFileUC {
  private assetRepo?: AssetRepo;

  private get fetchAssetFile() {
    return this.getCachedSingleton<FetchAssetFileFromAPIUC>(FetchAssetFileFromAPIUC.type)
      ?.doFetch;
  }

  private get getAsset() {
    return this.getCachedSingleton<GetAssetUC>(GetAssetUC.type)?.getAsset;
  }

  getAssetFile = (assetID: string): Promise<File> => {
    const assetRepo = this.assetRepo;
    const getAsset = this.getAsset;
    const fetchAssetFile = this.fetchAssetFile;

    if (!assetRepo || !getAsset || !fetchAssetFile) {
      return Promise.reject();
    }

    const existing = assetRepo.get(assetID);
    if (existing && existing.file) {
      return Promise.resolve(existing.file);
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
          }
          resolve(file);
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
    super(appObject, GetAssetFileUC.type);

    this.appObjects.registerSingleton(this);

    this.assetRepo = appObject.getComponent<AssetRepo>(AssetRepo.type);
    if (!this.assetRepo) {
      this.error("UC added to an App Object that does not have AssetRepo");
      return;
    }
  }
}
