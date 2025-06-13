/**
 * GetAssetUC.ts
 *
 * This use case handles retrieval of asset metadata, managing both local
 * repository cache and remote API fetching to ensure asset entities exist
 * and are properly configured.
 *
 * Key Concepts:
 * - Retrieves asset entities with metadata from local cache or remote API
 * - Maintains asset repository consistency for entity management
 * - Uses lazy loading to fetch assets only when needed
 * - Transforms API DTOs to local asset entities automatically
 * - Provides singleton access for system-wide asset retrieval
 *
 * Usage Patterns:
 * - Singleton use case accessed through static get() method
 * - Called with asset ID to ensure asset entity exists and is loaded
 * - Returns existing entities immediately or fetches from API as needed
 * - Used by other UCs that need asset entities for operations
 */

import {
  getSingletonComponent,
  AppObject,
  AppObjectRepo,
  AppObjectUC
} from "@vived/core";
import { FetchAssetMetaFromAPIUC } from "../../VivedAPI";
import { AssetEntity } from "../Entities/AssetEntity";
import { AssetRepo } from "../Entities/AssetRepo";

/**
 * GetAssetUC handles retrieval and caching of asset entities with metadata.
 *
 * This singleton use case ensures asset entities exist in the local repository,
 * fetching from the API when necessary and maintaining consistent entity state.
 */
export abstract class GetAssetUC extends AppObjectUC {
  /** Static type identifier for component registration */
  static type = "GetAssetUC";

  /**
   * Retrieves an asset entity, fetching from API if not already cached.
   *
   * @param assetID - The unique identifier of the asset
   * @returns Promise resolving to the asset entity with loaded metadata
   */
  abstract getAsset(assetID: string): Promise<AssetEntity>;

  /**
   * Retrieves the singleton GetAssetUC instance.
   *
   * @param appObjects - Repository for accessing the singleton component
   * @returns GetAssetUC instance or undefined if not found
   */
  static get(appObjects: AppObjectRepo): GetAssetUC | undefined {
    return getSingletonComponent<GetAssetUC>(GetAssetUC.type, appObjects);
  }
}

/**
 * Factory function to create a new GetAssetUC instance.
 *
 * @param appObject - The AppObject that will host this singleton use case (must have AssetRepo)
 * @returns A new GetAssetUC implementation instance
 */
export function makeGetAssetUC(appObject: AppObject): GetAssetUC {
  return new GetAssetUCImp(appObject);
}

/**
 * Private implementation of GetAssetUC with caching and API integration.
 *
 * Key Implementation Details:
 * - Checks local asset repository first for immediate access
 * - Falls back to API fetch when asset is not cached locally
 * - Transforms API DTOs to asset entities using repository methods
 * - Provides error handling and logging for debugging
 * - Validates required dependencies during initialization
 */
class GetAssetUCImp extends GetAssetUC {
  /** The asset repository for entity management and caching */
  private assetRepo?: AssetRepo;

  /**
   * Gets the API use case for fetching asset metadata from remote sources
   * Used when assets are not available in the local repository
   */
  private get fetchAssetMeta() {
    return this.getCachedSingleton<FetchAssetMetaFromAPIUC>(
      FetchAssetMetaFromAPIUC.type
    )?.doFetch;
  }

  /**
   * Retrieves an asset entity with intelligent caching.
   *
   * This method implements a two-tier strategy:
   * 1. Check local repository for existing entity (immediate return)
   * 2. Fetch from API and create entity if not cached
   *
   * The method ensures all requested assets are available as entities
   * in the local repository for subsequent operations.
   *
   * @param assetID - The unique identifier of the asset
   * @returns Promise resolving to the asset entity with loaded metadata
   */
  getAsset = (assetID: string): Promise<AssetEntity> => {
    const assetRepo = this.assetRepo;
    const fetchAssetMeta = this.fetchAssetMeta;

    if (!assetRepo || !fetchAssetMeta) {
      return Promise.reject();
    }

    // Check local repository first for immediate access
    if (assetRepo.has(assetID)) {
      return Promise.resolve(assetRepo.get(assetID)!);
    }

    // Asset not cached, fetch from API
    return new Promise((resolve, reject) => {
      fetchAssetMeta(assetID)
        .then((baseDTO) => {
          // Transform DTO to entity and add to repository
          const baseAsset = assetRepo.addFromDTO(baseDTO);
          resolve(baseAsset);
        })
        .catch((e: Error) => {
          this.warn(e.message);
          reject(e);
        });
    });
  };

  /**
   * Initializes the GetAssetUC with required dependencies and validation.
   *
   * @param appObject - The AppObject that should contain the AssetRepo for entity management
   */
  constructor(appObject: AppObject) {
    super(appObject, GetAssetUC.type);
    this.appObjects.registerSingleton(this);

    // Validate and cache the asset repository dependency
    this.assetRepo = appObject.getComponent<AssetRepo>(AssetRepo.type);
    if (!this.assetRepo) {
      this.error("UC added to an App Object that does not have AssetRepo");
      return;
    }
  }
}
