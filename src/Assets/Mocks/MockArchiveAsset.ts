import { AppObject, AppObjectRepo } from "@vived/core";
import { ArchiveAssetUC } from "../UCs/ArchiveAssetUC";

export class MockArchiveAssetUC extends ArchiveAssetUC {
  setArchived = jest.fn().mockResolvedValue(undefined);

  constructor(appObject: AppObject) {
    super(appObject, ArchiveAssetUC.type);
  }
}

export function makeMockArchiveAssetUC(appObjects: AppObjectRepo) {
  return new MockArchiveAssetUC(appObjects.getOrCreate("MockArchiveAssetUC"));
}
