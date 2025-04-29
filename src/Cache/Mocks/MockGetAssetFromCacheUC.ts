import { AppObject, AppObjectRepo } from "@vived/core";
import { GetAssetFromCacheUC } from "../UCs/GetAssetFromCacheUC";

export class MockGetAssetFromCacheUC extends GetAssetFromCacheUC {
  getAsset = jest
    .fn()
    .mockResolvedValue(new Blob(["mock content"], { type: "text/plain" }));

  constructor(appObject: AppObject) {
    super(appObject, GetAssetFromCacheUC.type);
    this.appObjects.registerSingleton(this);
  }
}

export function makeMockGetAssetFromCacheUC(appObjects: AppObjectRepo) {
  return new MockGetAssetFromCacheUC(
    appObjects.getOrCreate("MockGetAssetFromCacheUC")
  );
}
