import { AppObject, AppObjectRepo } from "@vived/core";
import { NewAppAssetUC } from "../UCs/NewAppAssetUC";

export class MockNewAppAssetUC extends NewAppAssetUC {
  create = jest.fn().mockResolvedValue(undefined);

  constructor(appObject: AppObject) {
    super(appObject, NewAppAssetUC.type);
  }
}

export function makeMockNewAppAssetUC(appObjects: AppObjectRepo) {
  return new MockNewAppAssetUC(appObjects.getOrCreate("MockNewAppAssetUC"));
}
