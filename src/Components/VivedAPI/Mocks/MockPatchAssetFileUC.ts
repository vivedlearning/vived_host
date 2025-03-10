import { AppObject, AppObjectRepo } from "@vived/core";
import { PatchAssetFileUC } from "../UCs/PatchAssetFileUC";

export class MockPatchAssetFileUC extends PatchAssetFileUC {
  doPatch = jest.fn().mockResolvedValue("new.filename");

  constructor(appObject: AppObject) {
    super(appObject, PatchAssetFileUC.type);
  }
}

export function mockMockPatchAssetFileUC(appObjects: AppObjectRepo) {
  return new MockPatchAssetFileUC(
    appObjects.getOrCreate("MockPatchAssetFileUC")
  );
}
