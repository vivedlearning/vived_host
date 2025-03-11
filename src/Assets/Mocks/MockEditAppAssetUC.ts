import { AppObject, AppObjectRepo } from "@vived/core";
import { EditAppAssetUC } from "../UCs/EditAppAssetUC";

export class MockEditAppAssetUC extends EditAppAssetUC {
  editAsset = jest.fn();

  constructor(appObject: AppObject) {
    super(appObject, EditAppAssetUC.type);
  }
}

export function makeMockEditAppAssetUC(appObjects: AppObjectRepo) {
  return new MockEditAppAssetUC(appObjects.getOrCreate("MockEditAppAssetUC"));
}
