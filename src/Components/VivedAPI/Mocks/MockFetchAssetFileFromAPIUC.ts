import { AppObject, AppObjectRepo } from "@vived/core";
import { FetchAssetFileFromAPIUC } from "../UCs/FetchAssetFileFromAPIUC";

export class MockFetchAssetFileFromAPIUC extends FetchAssetFileFromAPIUC {
  doFetch = jest.fn();

  constructor(appObject: AppObject) {
    super(appObject, FetchAssetFileFromAPIUC.type);
  }
}

export function makeMockFetchAssetFileFromAPIUC(appObjects: AppObjectRepo) {
  return new MockFetchAssetFileFromAPIUC(
    appObjects.getOrCreate("MockFetchAssetFileFromAPIUC")
  );
}
