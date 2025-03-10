import { AppObject, AppObjectRepo } from "@vived/core";
import { UpdateAppAssetMetaUC } from "../UCs/UpdateAppAssetMetaUC";

export class MockUpdateAppAssetMetaUC extends UpdateAppAssetMetaUC {
  updateMeta = jest.fn().mockResolvedValue(undefined);

  constructor(appObject: AppObject) {
    super(appObject, UpdateAppAssetMetaUC.type);
  }
}

export function makeMockUpdateAppAssetMetaUC(appObjects: AppObjectRepo) {
  return new MockUpdateAppAssetMetaUC(
    appObjects.getOrCreate("MockUpdateAppAssetMetaUC")
  );
}
