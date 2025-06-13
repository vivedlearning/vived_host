import {
  AppObject,
  AppObjectRepo,
  AppObjectUC,
  getSingletonComponent
} from "@vived/core";
import { AssetCacheEntity } from "../Entities/AssetCacheEntity";

export abstract class GetAssetFromCacheUC extends AppObjectUC {
  static readonly type = "GetAssetFromCacheUC";

  abstract getAsset(assetId: string): Promise<Blob | undefined>;

  static get(appObjects: AppObjectRepo): GetAssetFromCacheUC | undefined {
    return getSingletonComponent(GetAssetFromCacheUC.type, appObjects);
  }
}

export function makeGetAssetFromCacheUC(
  appObject: AppObject
): GetAssetFromCacheUC {
  return new GetAssetFromCacheUCImp(appObject);
}

class GetAssetFromCacheUCImp extends GetAssetFromCacheUC {
  private get assetCacheEntity(): AssetCacheEntity | undefined {
    return this.getCachedSingleton<AssetCacheEntity>(AssetCacheEntity.type);
  }

  getAsset = async (assetId: string): Promise<Blob | undefined> => {
    const assetCache = this.assetCacheEntity;
    if (!assetCache) {
      this.warn("AssetCacheEntity not found");
      return undefined;
    }

    try {
      return await assetCache.getAsset(assetId);
    } catch (e) {
      this.warn(`Error retrieving asset from cache for ID: ${assetId}`);
      return undefined;
    }
  };

  constructor(appObject: AppObject) {
    super(appObject, GetAssetFromCacheUC.type);
    this.appObjects.registerSingleton(this);
  }
}
