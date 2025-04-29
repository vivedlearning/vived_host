import {
  AppObject,
  AppObjectRepo,
  AppObjectUC,
  getSingletonComponent
} from "@vived/core";
import { AssetCacheEntity } from "../Entities/AssetCacheEntity";

export abstract class StoreAssetInCacheUC extends AppObjectUC {
  static readonly type = "StoreAssetInCacheUC";

  abstract storeAsset(
    assetId: string,
    content: Blob,
    contentType?: string
  ): Promise<void>;

  static get(appObjects: AppObjectRepo): StoreAssetInCacheUC | undefined {
    return getSingletonComponent(StoreAssetInCacheUC.type, appObjects);
  }
}

export function makeStoreAssetInCacheUC(
  appObject: AppObject
): StoreAssetInCacheUC {
  return new StoreAssetInCacheUCImp(appObject);
}

class StoreAssetInCacheUCImp extends StoreAssetInCacheUC {
  private get assetCacheEntity(): AssetCacheEntity | undefined {
    return this.getCachedSingleton<AssetCacheEntity>(AssetCacheEntity.type);
  }

  storeAsset = async (
    assetId: string,
    content: Blob,
    contentType?: string
  ): Promise<void> => {
    const assetCache = this.assetCacheEntity;
    if (!assetCache) {
      this.warn("AssetCacheEntity not found");
      return;
    }

    try {
      await assetCache.storeAsset(assetId, content, contentType);
    } catch (e) {
      this.warn(`Error storing asset in cache for ID: ${assetId}`);
    }
  }

  constructor(appObject: AppObject) {
    super(appObject, StoreAssetInCacheUC.type);
    this.appObjects.registerSingleton(this);
  }
}
