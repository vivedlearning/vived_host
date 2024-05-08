import { HostAppObject, HostAppObjectRepo } from "../../../HostAppObject";
import { PatchAssetIsArchivedUC } from "../UCs/PatchAssetIsArchivedUC";

export class MockPatchAssetIsArchivedUC extends PatchAssetIsArchivedUC {
  doPatch = jest.fn().mockResolvedValue(undefined);

  constructor(appObject: HostAppObject) {
    super(appObject, PatchAssetIsArchivedUC.type);
  }
}

export function makeMockPatchAssetIsArchivedUC(appObjects: HostAppObjectRepo) {
  return new MockPatchAssetIsArchivedUC(
    appObjects.getOrCreate("MockPatchAssetIsArchivedUC")
  );
}
