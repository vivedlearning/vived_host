import {
  AppObject,
  AppObjectEntity,
  AppObjectRepo,
  getSingletonComponent
} from "@vived/core";
import { CacheEntity } from "./CacheEntity";

/**
 * AssetCacheEntity provides functionality for caching binary assets in the application.
 * It serves as a specialized cache storage for assets such as images, videos, or other binary content.
 * This entity is implemented as a singleton component and requires a CacheEntity instance to function.
 */
export abstract class AssetCacheEntity extends AppObjectEntity {
  static readonly type = "AssetCacheEntity";

  /**
   * Retrieves an asset from the cache by its unique identifier.
   * @param assetId - The unique identifier of the asset to retrieve
   * @returns A Promise that resolves to the cached Blob if found, otherwise undefined
   */
  abstract getAsset(assetId: string): Promise<Blob | undefined>;

  /**
   * Stores an asset in the cache with the specified identifier.
   * @param assetId - The unique identifier to associate with the asset
   * @param content - The binary content to cache as a Blob
   * @param contentType - Optional MIME type of the content
   * @returns A Promise that resolves when the asset has been stored
   */
  abstract storeAsset(
    assetId: string,
    content: Blob,
    contentType?: string
  ): Promise<void>;

  /**
   * Checks if an asset exists in the cache.
   * @param assetId - The unique identifier of the asset to check
   * @returns A Promise that resolves to true if the asset exists, otherwise false
   */
  abstract hasAsset(assetId: string): Promise<boolean>;

  /**
   * Removes an asset from the cache.
   * @param assetId - The unique identifier of the asset to invalidate
   * @returns A Promise that resolves when the asset has been invalidated
   */
  abstract invalidateAsset(assetId: string): Promise<void>;

  /**
   * Gets the singleton instance of AssetCacheEntity from the app objects repository.
   * @param appObjects - The app objects repository
   * @returns The AssetCacheEntity instance if found, otherwise undefined
   */
  static get(appObjects: AppObjectRepo): AssetCacheEntity | undefined {
    return getSingletonComponent<AssetCacheEntity>(
      AssetCacheEntity.type,
      appObjects
    );
  }
}

export function makeAssetCacheEntity(appObject: AppObject): AssetCacheEntity {
  return new AssetCacheEntityImp(appObject);
}

type AssetCacheMetadata = {
  assetId: string;
  timestamp: number;
  contentType?: string;
};

class AssetCacheEntityImp extends AssetCacheEntity {
  private get cacheEntity(): CacheEntity | undefined {
    return this.getCachedSingleton<CacheEntity>(CacheEntity.type);
  }

  constructor(appObject: AppObject) {
    super(appObject, AssetCacheEntity.type);
    this.appObjects.registerSingleton(this);
  }

  async getAsset(assetId: string): Promise<Blob | undefined> {
    const cacheKey = this.generateCacheKey(assetId);

    const cacheEntity = this.cacheEntity;
    if (!cacheEntity) {
      this.warn("CacheEntity not found");
      return undefined;
    }

    try {
      const { value, metadata } = await cacheEntity.get(cacheKey);
      if (value instanceof Blob) {
        return value;
      }

      // Handle case where the value is stored as an ArrayBuffer
      if (value instanceof ArrayBuffer || ArrayBuffer.isView(value)) {
        const contentType = metadata?.contentType || "application/octet-stream";
        return new Blob([value], { type: contentType });
      }

      this.warn("Cached asset is not a Blob or ArrayBuffer");
      return undefined;
    } catch (e) {
      return undefined;
    }
  }

  async storeAsset(
    assetId: string,
    content: Blob,
    contentType?: string
  ): Promise<void> {
    const cacheKey = this.generateCacheKey(assetId);

    const cacheEntity = this.cacheEntity;
    if (!cacheEntity) {
      this.warn("CacheEntity not found");
      return;
    }

    const metadata: AssetCacheMetadata = {
      assetId,
      timestamp: Date.now(),
      contentType: contentType || content.type
    };

    await cacheEntity.store(cacheKey, content, metadata);
  }

  async hasAsset(assetId: string): Promise<boolean> {
    const cacheKey = this.generateCacheKey(assetId);

    const cacheEntity = this.cacheEntity;
    if (!cacheEntity) {
      this.warn("CacheEntity not found");
      return false;
    }

    return await cacheEntity.has(cacheKey);
  }

  async invalidateAsset(assetId: string): Promise<void> {
    const cacheEntity = this.cacheEntity;
    if (!cacheEntity) {
      this.warn("CacheEntity not found");
      return;
    }

    const cacheKey = this.generateCacheKey(assetId);
    await cacheEntity.invalidate(cacheKey);
  }

  private generateCacheKey(assetId: string): string {
    return `asset:${assetId}`;
  }
}
