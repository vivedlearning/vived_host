import { AppObject, AppObjectRepo } from "@vived/core";
import { StoreAssetInCacheUC } from "../UCs/StoreAssetInCacheUC";

export class MockStoreAssetInCacheUC extends StoreAssetInCacheUC {
  storeAsset = jest.fn().mockResolvedValue(undefined);

  constructor(appObject: AppObject) {
    super(appObject, StoreAssetInCacheUC.type);
    this.appObjects.registerSingleton(this);
  }
}

export function makeMockStoreAssetInCacheUC(appObjects: AppObjectRepo) {
  return new MockStoreAssetInCacheUC(
    appObjects.getOrCreate("MockStoreAssetInCacheUC")
  );
}
