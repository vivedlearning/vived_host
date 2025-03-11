import { AppObject, AppObjectRepo } from "@vived/core";
import { PatchAssetMetaUC } from "../UCs";

export class MockPatchAssetMetaUC extends PatchAssetMetaUC {
  doPatch = jest.fn().mockResolvedValue(undefined);

  constructor(appObject: AppObject) {
    super(appObject, PatchAssetMetaUC.type);
  }
}

export function makeMockPatchAssetMetaUC(appObjects: AppObjectRepo) {
  return new MockPatchAssetMetaUC(
    appObjects.getOrCreate("MockPatchAssetMetaUC")
  );
}
