import { AppObject, AppObjectRepo } from "@vived/core";
import { PrefetchAssetsUC } from "../UCs/PrefetchAssetsUC";

export class MockPrefetchAssetsUC extends PrefetchAssetsUC {
  prefetchAssets = jest.fn().mockResolvedValue(undefined);

  constructor(appObject: AppObject) {
    super(appObject, PrefetchAssetsUC.type);
  }
}

export function makeMockPrefetchAssetsUC(appObjects: AppObjectRepo) {
  return new MockPrefetchAssetsUC(
    appObjects.getOrCreate("MockPrefetchAssetsUC")
  );
}
