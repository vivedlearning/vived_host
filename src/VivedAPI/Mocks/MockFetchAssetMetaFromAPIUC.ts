import { AppObject, AppObjectRepo } from "@vived/core";
import { FetchAssetMetaFromAPIUC } from "../UCs/FetchAssetMetaFromAPIUC";

export class MockFetchAssetMetaFromAPIUC extends FetchAssetMetaFromAPIUC {
  doFetch = jest.fn();

  constructor(appObject: AppObject) {
    super(appObject, FetchAssetMetaFromAPIUC.type);
  }
}

export function makeMockFetchAssetMetaFromAPIUC(appObjects: AppObjectRepo) {
  return new MockFetchAssetMetaFromAPIUC(
    appObjects.getOrCreate("MockFetchAssetMetaFromAPIUC")
  );
}
