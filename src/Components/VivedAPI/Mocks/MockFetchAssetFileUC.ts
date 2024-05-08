import { HostAppObject, HostAppObjectRepo } from "../../../HostAppObject";
import { FetchAssetFileUC } from "../UCs/FetchAssetFileUC";

export class MockFetchAssetFileUC extends FetchAssetFileUC {
  doFetch = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, FetchAssetFileUC.type);
  }
}

export function makeMockFetchAssetFileUC(appObjects: HostAppObjectRepo) {
  return new MockFetchAssetFileUC(appObjects.getOrCreate("MockFetchAssetFileUC"));
}
