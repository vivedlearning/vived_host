import { AppObject, AppObjectRepo } from "@vived/core";
import { PatchAssetIsArchivedUC } from "../UCs/PatchAssetIsArchivedUC";

export class MockPatchAssetIsArchivedUC extends PatchAssetIsArchivedUC {
  doPatch = jest.fn().mockResolvedValue(undefined);

  constructor(appObject: AppObject) {
    super(appObject, PatchAssetIsArchivedUC.type);
  }
}

export function makeMockPatchAssetIsArchivedUC(appObjects: AppObjectRepo) {
  return new MockPatchAssetIsArchivedUC(
    appObjects.getOrCreate("MockPatchAssetIsArchivedUC")
  );
}
