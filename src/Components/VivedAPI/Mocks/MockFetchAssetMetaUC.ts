import { HostAppObject, HostAppObjectRepo } from "../../../HostAppObject";
import { FetchAssetMetaUC } from "../UCs/FetchAssetMetaUC";

export class MockFetchAssetMetaUC extends FetchAssetMetaUC {
  doFetch = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, FetchAssetMetaUC.type);
  }
}

export function makeMockFetchAssetMetaUC(appObjects: HostAppObjectRepo) {
  return new MockFetchAssetMetaUC(
    appObjects.getOrCreate("MockFetchAssetMetaUC")
  );
}
