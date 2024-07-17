import { HostAppObject, HostAppObjectRepo } from "../../../HostAppObject";
import { PrefetchAssetsUC } from "../UCs/PrefetchAssetsUC";

export class MockPrefetchAssetsUC extends PrefetchAssetsUC {
  prefetchAssets = jest.fn().mockResolvedValue(undefined);

  constructor(appObject: HostAppObject) {
    super(appObject, PrefetchAssetsUC.type);
  }
}

export function makeMockPrefetchAssetsUC(appObjects: HostAppObjectRepo) {
  return new MockPrefetchAssetsUC(
    appObjects.getOrCreate("MockPrefetchAssetsUC")
  );
}
