import { AppObject, AppObjectRepo } from "@vived/core";
import { UpdateAssetFileUC } from "../UCs/UpdateAssetFileUC";

export class MockUpdateAssetFileUC extends UpdateAssetFileUC {
  updateFile = jest.fn().mockResolvedValue("newFile.name");

  constructor(appObject: AppObject) {
    super(appObject, UpdateAssetFileUC.type);
  }
}

export function makeMockUpdateAssetFileUC(appObjects: AppObjectRepo) {
  return new MockUpdateAssetFileUC(
    appObjects.getOrCreate("MockUpdateAssetFileUC")
  );
}
