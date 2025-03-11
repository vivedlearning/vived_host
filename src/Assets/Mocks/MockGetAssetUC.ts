import { AppObject, AppObjectRepo } from "@vived/core";
import { GetAssetUC } from "../UCs/GetAssetUC";

export class MockGetAssetUC extends GetAssetUC {
  getAsset = jest.fn();

  constructor(appObject: AppObject) {
    super(appObject, GetAssetUC.type);
  }
}

export function makeMockGetAssetUC(appObjects: AppObjectRepo) {
  return new MockGetAssetUC(appObjects.getOrCreate("MockGetAssetUC"));
}
