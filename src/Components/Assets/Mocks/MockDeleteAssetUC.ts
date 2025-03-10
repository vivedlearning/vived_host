import { AppObject, AppObjectRepo } from "@vived/core";
import { DeleteAssetUC } from "../UCs/DeleteAssetUC";

export class MockDeleteAssetUC extends DeleteAssetUC {
  delete = jest.fn().mockResolvedValue(undefined);
  deleteWithConfirm = jest.fn();

  constructor(appObject: AppObject) {
    super(appObject, DeleteAssetUC.type);
  }
}

export function makeMockDeleteAssetUC(appObjects: AppObjectRepo) {
  return new MockDeleteAssetUC(appObjects.getOrCreate("MockDeleteAssetUC"));
}
