/**
 * GetAssetFileUC.ts
 *
 * This use case handles retrieval of asset files with advanced caching strategies,
 * returning File objects for use in web applications and file operations.
 *
 * Key Concepts:
 * - Retrieves asset files as File objects with multi-level caching optimization
 * - Checks memory cache (existing entities) first for immediate access
 * - Falls back to persistent cache (IndexedDB/localStorage) for faster retrieval
 * - Finally fetches from remote API when cache misses occur
 * - Manages fetch state indicators and error handling for user feedback
 * - Automatically stores fetched files in cache for future access
 *
 * Usage Patterns:
 * - Singleton use case accessed through static get() method
 * - Called with asset ID to retrieve File object for processing or display
 * - Handles async operations with comprehensive error handling
 * - Optimizes performance through intelligent caching strategies
 */

import {
  getSingletonComponent,
  AppObject,
  AppObjectRepo,
  AppObjectUC
} from "@vived/core";
import { FetchAssetFileFromAPIUC } from "../../VivedAPI";
import { GetAssetFromCacheUC, StoreAssetInCacheUC } from "../../Cache";
import { AssetRepo } from "../Entities/AssetRepo";
import { GetAssetUC } from "./GetAssetUC";

/**
 * GetAssetFileUC handles optimized retrieval of asset files as File objects.
 *
 * This singleton use case implements a multi-level caching strategy to minimize
 * network requests and provide fast access to asset files for web applications.
 */
export abstract class GetAssetFileUC extends AppObjectUC {
  /** Static type identifier for component registration */
  static type = "GetAssetFileUC";

  /**
   * Retrieves a File object for the specified asset.
   *
   * @param assetID - The unique identifier of the asset
   * @returns Promise resolving to a File object for the asset
   */
  abstract getAssetFile(assetID: string): Promise<File>;

  /**
   * Retrieves the singleton GetAssetFileUC instance.
   *
   * @param appObjects - Repository for accessing the singleton component
   * @returns GetAssetFileUC instance or undefined if not found
   */
  static get(appObjects: AppObjectRepo): GetAssetFileUC | undefined {
    return getSingletonComponent<GetAssetFileUC>(
      GetAssetFileUC.type,
      appObjects
    );
  }
}

/**
 * Factory function to create a new GetAssetFileUC instance.
 *
 * @param appObject - The AppObject that will host this singleton use case
 * @returns A new GetAssetFileUC implementation instance
 */
export function makeGetAssetFileUC(appObject: AppObject): GetAssetFileUC {
  return new GetAssetFileUCImp(appObject);
}

/**
 * Private implementation of GetAssetFileUC with advanced caching and error handling.
 *
 * Key Implementation Details:
 * - Implements three-tier caching: memory (entities), persistent cache, and remote API
 * - Uses async/await for cleaner error handling and flow control
 * - Manages fetch state indicators for user feedback during operations
 * - Automatically caches fetched files for future access optimization
 * - Handles cache failures gracefully with fallback to direct API access
 * - Converts between Blob and File objects maintaining metadata integrity
 * - Provides detailed error handling and logging for debugging
 */
class GetAssetFileUCImp extends GetAssetFileUC {
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
   * Retrieves an asset file using optimized multi-level caching.
   *
   * This method implements a three-tier caching strategy:
   * 1. Memory cache: Check if asset entity already has a File object
   * 2. Persistent cache: Check IndexedDB/localStorage for cached file
   * 3. Remote API: Fetch from backend as last resort
   *
   * Each level provides progressively better performance, with automatic
   * population of higher-level caches for future access optimization.
   *
   * @param assetID - The unique identifier of the asset
   * @returns Promise resolving to a File object for the asset
   */
  getAssetFile = async (assetID: string): Promise<File> => {
    const assetRepo = this.assetRepo;
    const getAsset = this.getAsset;
    const fetchAssetFile = this.fetchAssetFile;

    // Check for required dependencies
    if (!assetRepo || !getAsset || !fetchAssetFile) {
      return Promise.reject(new Error("Missing required dependencies"));
    }

    // Level 1: Check memory cache (existing entities with File objects)
    const existingAsset = assetRepo.get(assetID);
    if (existingAsset?.file) {
      return existingAsset.file;
    }

    // Level 2 & 3: Try cache then API with comprehensive error handling
    try {
      return await this.tryGetFromCacheOrFetch(assetID);
    } catch (error) {
      // If cache access failed, try the normal flow
      this.warn(`Cache error: ${(error as Error).message}`);
      return this.fetchAssetDirectly(assetID);
    }
  };

  /**
   * Attempts to retrieve from cache or falls back to direct API fetch.
   *
   * @param assetID - The unique identifier of the asset
   * @returns Promise resolving to a File object
   */
  private async tryGetFromCacheOrFetch(assetID: string): Promise<File> {
    const getAssetFromCache = this.getAssetFromCache;

    // If no cache is available, go straight to normal fetching
    if (!getAssetFromCache) {
      return this.fetchAssetDirectly(assetID);
    }

    // Try to get the asset from cache
    const cachedBlob = await getAssetFromCache(assetID);

    if (cachedBlob) {
      // Asset found in cache, get metadata and create file
      return this.createFileFromCachedBlob(assetID, cachedBlob);
    } else {
      // Not in cache, fetch directly
      return this.fetchAssetDirectly(assetID);
    }
  }

  /**
   * Creates a File object from cached blob data and asset metadata.
   *
   * @param assetID - The unique identifier of the asset
   * @param cachedBlob - The cached blob data
   * @returns Promise resolving to a File object with proper metadata
   */
  private async createFileFromCachedBlob(
    assetID: string,
    cachedBlob: Blob
  ): Promise<File> {
    const getAsset = this.getAsset;

    if (!getAsset) {
      throw new Error("Required dependencies not found");
    }

    // Get asset metadata
    const asset = await getAsset(assetID);

    // Convert blob to file with proper metadata
    const filename = asset.filename || "cached-asset";
    const file = new File([cachedBlob], filename, {
      type: cachedBlob.type
    });

    // Update asset state
    asset.setFile(file);
    asset.isFetchingFile = false;

    return file;
  }

  /**
   * Fetches asset file directly from API with state management.
   *
   * @param assetID - The unique identifier of the asset
   * @returns Promise resolving to a File object
   */
  private async fetchAssetDirectly(assetID: string): Promise<File> {
    const getAsset = this.getAsset;
    const fetchAssetFile = this.fetchAssetFile;

    if (!getAsset || !fetchAssetFile) {
      throw new Error("Required dependencies not found");
    }

    try {
      // Get asset and prepare for fetching
      const asset = await getAsset(assetID);
      asset.isFetchingFile = true;
      asset.fetchError = undefined;

      // Fetch the file
      const file = await fetchAssetFile(asset);

      // Update asset state
      asset.setFile(file);
      asset.isFetchingFile = false;

      // Try to store in cache for future optimization
      await this.tryCacheAssetFile(assetID, file);

      return file;
    } catch (error) {
      await this.handleFetchError(assetID, error as Error);
      throw error;
    }
  }

  /**
   * Handles fetch errors by updating asset state appropriately.
   *
   * @param assetID - The unique identifier of the asset
   * @param error - The error that occurred during fetching
   */
  private async handleFetchError(assetID: string, error: Error): Promise<void> {
    const getAsset = this.getAsset;

    if (!getAsset) {
      return;
    }

    try {
      const asset = await getAsset(assetID);
      asset.fetchError = error;
      asset.isFetchingFile = false;
    } catch {
      // If we can't get the asset, we can't update its error state
    }
  }

  /**
   * Attempts to cache the fetched file for future optimization.
   *
   * @param assetID - The unique identifier of the asset
   * @param file - The file to cache
   */
  private async tryCacheAssetFile(assetID: string, file: File): Promise<void> {
    const storeAssetInCache = this.storeAssetInCache;

    if (!storeAssetInCache) {
      return;
    }

    try {
      await storeAssetInCache(
        assetID,
        new Blob([file], { type: file.type }),
        file.type
      );
    } catch (e) {
      this.warn(`Failed to cache asset: ${(e as Error).message}`);
    }
  }

  /**
   * Initializes the GetAssetFileUC and registers it as a singleton.
   *
   * @param appObject - The AppObject that will host this singleton use case
   */
  constructor(appObject: AppObject) {
    super(appObject, GetAssetFileUC.type);
    this.appObjects.registerSingleton(this);
  }
}
