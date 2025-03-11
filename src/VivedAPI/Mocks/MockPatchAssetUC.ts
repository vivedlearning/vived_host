import { AppObject, AppObjectRepo } from "@vived/core";
import { PatchAssetUC } from "../UCs/PatchAssetUC";

export class MockPatchAssetUC extends PatchAssetUC {
  doPatch = jest.fn().mockResolvedValue(undefined);

  constructor(appObject: AppObject) {
    super(appObject, PatchAssetUC.type);
  }
}

export function makeMockPatchAssetUC(appObjects: AppObjectRepo) {
  return new MockPatchAssetUC(appObjects.getOrCreate("MockPatchAssetUC"));
}
