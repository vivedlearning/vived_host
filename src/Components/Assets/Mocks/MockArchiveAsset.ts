
import { HostAppObject, HostAppObjectRepo } from "../../../HostAppObject";
import { ArchiveAssetUC } from "../UCs/ArchiveAssetUC";

export class MockArchiveAssetUC extends ArchiveAssetUC {
  setArchived = jest.fn().mockResolvedValue(undefined);

  constructor(appObject: HostAppObject) {
    super(appObject, ArchiveAssetUC.type);
  }
}

export function makeMockArchiveAssetUC(appObjects: HostAppObjectRepo) {
  return new MockArchiveAssetUC(appObjects.getOrCreate("MockArchiveAssetUC"));
}
