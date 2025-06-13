/**
 * GetAssetBlobURLUC.ts
 * 
 * This use case provides optimized asset file retrieval with caching support,
 * returning blob URLs for immediate use in web applications.
 * 
 * Key Concepts:
 * - Provides blob URLs for asset files with multi-level caching optimization
 * - Checks memory cache (existing entities) first for immediate access
 * - Falls back to persistent cache (IndexedDB/localStorage) for faster retrieval
 * - Finally fetches from remote API when cache misses occur
 * - Manages fetch state indicators for UI feedback
 * - Automatically stores fetched files in cache for future access
 * 
 * Usage Patterns:
 * - Singleton use case accessed through static get() method
 * - Called with asset ID to retrieve blob URL for display or download
 * - Handles async operations with comprehensive error handling
 * - Optimizes performance through multi-level caching strategy
 */

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

/**
 * GetAssetBlobURLUC handles optimized retrieval of asset files as blob URLs.
 * 
 * This singleton use case implements a multi-level caching strategy to minimize
 * network requests and provide fast access to asset files for web applications.
 */
export abstract class GetAssetBlobURLUC extends AppObjectUC {
  /** Static type identifier for component registration */
  static type = "GetAssetBlobURLUC";

  /**
   * Retrieves a blob URL for the specified asset file.
   * 
   * @param assetID - The unique identifier of the asset
   * @returns Promise resolving to a blob URL for immediate use
   */
  abstract getAssetBlobURL(assetID: string): Promise<string>;

  /**
   * Retrieves the singleton GetAssetBlobURLUC instance.
   * 
   * @param appObjects - Repository for accessing the singleton component
   * @returns GetAssetBlobURLUC instance or undefined if not found
   */
  static get(appObjects: AppObjectRepo): GetAssetBlobURLUC | undefined {
    return getSingletonComponent<GetAssetBlobURLUC>(
      GetAssetBlobURLUC.type,
      appObjects
    );
  }
}

/**
 * Factory function to create a new GetAssetBlobURLUC instance.
 * 
 * @param appObject - The AppObject that will host this singleton use case
 * @returns A new GetAssetBlobURLUC implementation instance
 */
export function makeGetAssetBlobURLUC(appObject: AppObject): GetAssetBlobURLUC {
  return new GetAssetBlobURLUCImp(appObject);
}

/**
 * Private implementation of GetAssetBlobURLUC with multi-level caching strategy.
 * 
 * Key Implementation Details:
 * - Implements three-tier caching: memory (entities), persistent cache, and remote API
 * - Manages fetch state indicators for user feedback during operations
 * - Automatically caches fetched files for future access optimization
 * - Handles cache failures gracefully with fallback to direct API access
 * - Converts between Blob and File objects for compatibility
 * - Provides detailed error handling and logging for debugging
 */
class GetAssetBlobURLUCImp extends GetAssetBlobURLUC {
  /** Gets the asset repository for entity management and lookup */
  private get assetRepo() {
    return this.getCachedSingleton<AssetRepo>(AssetRepo.type);
  }

  /** Gets the API use case for fetching asset files from remote sources */
  private get fetchAssetFile() {
    return this.getCachedSingleton<FetchAssetFileFromAPIUC>(
      FetchAssetFileFromAPIUC.type
    )?.doFetch;
  }

  /** Gets the use case for retrieving asset metadata */
  private get getAsset() {
    return this.getCachedSingleton<GetAssetUC>(GetAssetUC.type)?.getAsset;
  }

  /** Gets the use case for retrieving assets from persistent cache */
  private get getAssetFromCache() {
    return this.getCachedSingleton<GetAssetFromCacheUC>(
      GetAssetFromCacheUC.type
    )?.getAsset;
  }

  /** Gets the use case for storing assets in persistent cache */
  private get storeAssetInCache() {
    return this.getCachedSingleton<StoreAssetInCacheUC>(
      StoreAssetInCacheUC.type
    )?.storeAsset;
  }

  /**
   * Retrieves an asset blob URL using optimized multi-level caching.
   * 
   * This method implements a three-tier caching strategy:
   * 1. Memory cache: Check if asset entity already has a blob URL
   * 2. Persistent cache: Check IndexedDB/localStorage for cached file
   * 3. Remote API: Fetch from backend as last resort
   * 
   * Each level provides progressively better performance, with automatic
   * population of higher-level caches for future access optimization.
   * 
   * @param assetID - The unique identifier of the asset
   * @returns Promise resolving to a blob URL for the asset file
   */
  getAssetBlobURL = (assetID: string): Promise<string> => {
    const assetRepo = this.assetRepo;
    const getAsset = this.getAsset;
    const fetchAssetFile = this.fetchAssetFile;
    const getAssetFromCache = this.getAssetFromCache;
    const storeAssetInCache = this.storeAssetInCache;

    if (!assetRepo || !getAsset || !fetchAssetFile) {
      return Promise.reject();
    }

    // Level 1: Check memory cache (existing entities with blob URLs)
    const existing = assetRepo.get(assetID);
    if (existing && existing.blobURL) {
      return Promise.resolve(existing.blobURL);
    }

    return new Promise((resolve, reject) => {
      let fetchedAsset: AssetEntity | undefined;

      // Level 2: Check persistent cache
      if (getAssetFromCache) {
        getAssetFromCache(assetID)
          .then((cachedBlob) => {
            if (cachedBlob) {
              // Asset found in cache, get metadata and create file
              return getAsset(assetID).then((asset) => {
                fetchedAsset = asset;
                const filename = asset.filename || "cached-asset";
                return new File([cachedBlob], filename, {
                  type: cachedBlob.type
                });
              });
            } else {
              // Level 3: Fetch from remote API
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
              // Create blob URL and update entity
              fetchedAsset.setFile(file);
              fetchedAsset.isFetchingFile = false;

              // Store in cache for future access (if not from cache already)
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
            // Cache error, fallback to normal flow
            this.warn(`Cache error or fetch error: ${e.message}`);
            this.fetchAssetNormally(assetID, resolve, reject);
          });
      } else {
        // No cache available, use direct API access
        this.fetchAssetNormally(assetID, resolve, reject);
      }
    });
  };

  /**
   * Helper method for direct asset fetching without cache support.
   * 
   * This method handles the direct API fetch workflow when caching
   * is not available or has failed. It still attempts to store the
   * result in cache for future optimization.
   * 
   * @param assetID - The unique identifier of the asset
   * @param resolve - Success callback with blob URL
   * @param reject - Error callback with error details
   */
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
        // Set loading state for UI feedback
        asset.isFetchingFile = true;
        asset.fetchError = undefined;
        fetchedAsset = asset;
        return fetchAssetFile(asset);
      })
      .then((file) => {
        if (fetchedAsset) {
          // Create blob URL and update entity
          fetchedAsset.setFile(file);
          fetchedAsset.isFetchingFile = false;

          // Store in cache for future optimization (if available)
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
        // Handle fetch errors with proper state cleanup
        if (fetchedAsset) {
          fetchedAsset.fetchError = e;
          fetchedAsset.isFetchingFile = false;
        }
        reject(e);
      });
  };

  /**
   * Initializes the GetAssetBlobURLUC and registers it as a singleton.
   * 
   * @param appObject - The AppObject that will host this singleton use case
   */
  constructor(appObject: AppObject) {
    super(appObject, GetAssetBlobURLUC.type);
    this.appObjects.registerSingleton(this);
  }
}
