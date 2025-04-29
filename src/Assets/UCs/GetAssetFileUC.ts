import {
  getSingletonComponent,
  AppObject,
  AppObjectRepo,
  AppObjectUC
} from "@vived/core";
import { FetchAssetFileFromAPIUC } from "../../VivedAPI";
import { GetAssetFromCacheUC, StoreAssetInCacheUC } from "../../Cache";
import { AssetEntity } from "../Entities/AssetEntity";
import { AssetRepo } from "../Entities/AssetRepo";
import { GetAssetUC } from "./GetAssetUC";

export abstract class GetAssetFileUC extends AppObjectUC {
  static type = "GetAssetFileUC";

  abstract getAssetFile(assetID: string): Promise<File>;

  static get(appObjects: AppObjectRepo): GetAssetFileUC | undefined {
    return getSingletonComponent<GetAssetFileUC>(
      GetAssetFileUC.type,
      appObjects
    );
  }
}

export function makeGetAssetFileUC(appObject: AppObject): GetAssetFileUC {
  return new GetAssetFileUCImp(appObject);
}

class GetAssetFileUCImp extends GetAssetFileUC {
  private assetRepo?: AssetRepo;

  private get fetchAssetFile() {
    return this.getCachedSingleton<FetchAssetFileFromAPIUC>(
      FetchAssetFileFromAPIUC.type
    )?.doFetch;
  }

  private get getAsset() {
    return this.getCachedSingleton<GetAssetUC>(GetAssetUC.type)?.getAsset;
  }

  private get getAssetFromCache() {
    return this.getCachedSingleton<GetAssetFromCacheUC>(
      GetAssetFromCacheUC.type
    )?.getAsset;
  }

  private get storeAssetInCache() {
    return this.getCachedSingleton<StoreAssetInCacheUC>(
      StoreAssetInCacheUC.type
    )?.storeAsset;
  }

  getAssetFile = (assetID: string): Promise<File> => {
    const assetRepo = this.assetRepo;
    const getAsset = this.getAsset;
    const fetchAssetFile = this.fetchAssetFile;
    const getAssetFromCache = this.getAssetFromCache;
    const storeAssetInCache = this.storeAssetInCache;

    if (!assetRepo || !getAsset || !fetchAssetFile) {
      return Promise.reject();
    }

    // Check if asset already exists in memory
    const existing = assetRepo.get(assetID);
    if (existing && existing.file) {
      return Promise.resolve(existing.file);
    }

    return new Promise((resolve, reject) => {
      let fetchedAsset: AssetEntity | undefined;

      // First check if the asset exists in cache
      if (getAssetFromCache) {
        getAssetFromCache(assetID)
          .then((cachedBlob) => {
            if (cachedBlob) {
              // Asset found in cache, get metadata
              return getAsset(assetID).then((asset) => {
                fetchedAsset = asset;
                // Convert Blob to File
                const filename = asset.filename || "cached-asset";
                return new File([cachedBlob], filename, {
                  type: cachedBlob.type
                });
              });
            } else {
              // Not in cache, get asset and fetch from API
              return getAsset(assetID).then((asset) => {
                asset.isFetchingFile = true;
                asset.fetchError = undefined;
                fetchedAsset = asset;
                return fetchAssetFile(asset);
              });
            }
          })
          .then((file) => {
            if (fetchedAsset) {
              fetchedAsset.setFile(file);
              fetchedAsset.isFetchingFile = false;

              // Store the fetched file in cache if not from cache already
              if (storeAssetInCache) {
                storeAssetInCache(
                  assetID,
                  new Blob([file], { type: file.type }),
                  file.type
                ).catch((e) => {
                  this.warn(`Failed to cache asset: ${e.message}`);
                });
              }
            }
            resolve(file);
          })
          .catch((e: Error) => {
            // Cache error or fetch error, try normal flow
            this.warn(`Cache error or fetch error: ${e.message}`);
            this.fetchAssetNormally(assetID, resolve, reject);
          });
      } else {
        // No cache available, use normal flow
        this.fetchAssetNormally(assetID, resolve, reject);
      }
    });
  };

  // Helper method for the normal asset fetching flow without cache
  private fetchAssetNormally = (
    assetID: string,
    resolve: (file: File) => void,
    reject: (error: Error) => void
  ): void => {
    const getAsset = this.getAsset;
    const fetchAssetFile = this.fetchAssetFile;
    const storeAssetInCache = this.storeAssetInCache;

    if (!getAsset || !fetchAssetFile) {
      reject(new Error("Required dependencies not found"));
      return;
    }

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

          // Store the fetched file in cache if caching is available
          if (storeAssetInCache) {
            storeAssetInCache(
              assetID,
              new Blob([file], { type: file.type }),
              file.type
            ).catch((e) => {
              this.warn(`Failed to cache asset: ${e.message}`);
            });
          }
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
  };

  constructor(appObject: AppObject) {
    super(appObject, GetAssetFileUC.type);

    this.appObjects.registerSingleton(this);

    this.assetRepo = appObject.getComponent<AssetRepo>(AssetRepo.type);
    if (!this.assetRepo) {
      this.error("UC added to an App Object that does not have AssetRepo");
      return;
    }
  }
}
