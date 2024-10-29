import { HostAppObject, HostAppObjectRepo } from "../../../HostAppObject";
import { PatchAssetMetaUC } from "../UCs";
import { PatchAssetUC } from "../UCs/PatchAssetUC";


export class MockPatchAssetMetaUC extends PatchAssetMetaUC {
  doPatch = jest.fn().mockResolvedValue(undefined);

  constructor(appObject: HostAppObject) {
    super(appObject, PatchAssetUC.type);
  }
}

export function makeMockPatchAssetMetaUC(appObjects: HostAppObjectRepo) {
  return new MockPatchAssetMetaUC(appObjects.getOrCreate("MockPatchAssetMetaUC"));
}
