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
  private get assetRepo() {
    return this.getCachedSingleton<AssetRepo>(AssetRepo.type);
  }

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

  getAssetBlobURL = (assetID: string): Promise<string> => {
    const assetRepo = this.assetRepo;
    const getAsset = this.getAsset;
    const fetchAssetFile = this.fetchAssetFile;
    const getAssetFromCache = this.getAssetFromCache;
    const storeAssetInCache = this.storeAssetInCache;

    if (!assetRepo || !getAsset || !fetchAssetFile) {
      return Promise.reject();
    }

    // Check if asset already exists in memory with a blob URL
    const existing = assetRepo.get(assetID);
    if (existing && existing.blobURL) {
      return Promise.resolve(existing.blobURL);
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

              if (fetchedAsset.blobURL) {
                resolve(fetchedAsset.blobURL);
                return;
              }
            }
            reject(new Error("Blob URL is empty"));
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
    resolve: (blobURL: string) => void,
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
  };

  constructor(appObject: AppObject) {
    super(appObject, GetAssetBlobURLUC.type);

    this.appObjects.registerSingleton(this);
  }
}
