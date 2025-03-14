import { AppObject, AppObjectRepo } from "@vived/core";
import { NewAssetUC } from "../UCs/NewAssetUC";

export class MockNewAssetUC extends NewAssetUC {
  create = jest.fn().mockResolvedValue("newAssetID");

  constructor(appObject: AppObject) {
    super(appObject, NewAssetUC.type);
  }
}

export function makeMockNewAssetUC(appObjects: AppObjectRepo) {
  return new MockNewAssetUC(appObjects.getOrCreate("MockNewAssetUC"));
}
