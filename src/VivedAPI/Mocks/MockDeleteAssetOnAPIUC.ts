import { AppObject, AppObjectRepo } from "@vived/core";
import { DeleteAssetOnAPIUC } from "../UCs/DeleteAssetOnAPIUC";

export class MockDeleteAssetOnAPIUC extends DeleteAssetOnAPIUC {
  doDelete = jest.fn().mockResolvedValue(undefined);

  constructor(appObject: AppObject) {
    super(appObject, DeleteAssetOnAPIUC.type);
  }
}

export function makeMockDeleteAssetOnAPIUC(appObjects: AppObjectRepo) {
  return new MockDeleteAssetOnAPIUC(
    appObjects.getOrCreate("DeleteAssetOnAPIUC")
  );
}
