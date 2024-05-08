import { HostAppObject, HostAppObjectRepo } from "../../../HostAppObject";
import { PatchAssetUC } from "../UCs/PatchAssetUC";


export class MockPatchAssetUC extends PatchAssetUC {
  doPatch = jest.fn().mockResolvedValue(undefined);

  constructor(appObject: HostAppObject) {
    super(appObject, PatchAssetUC.type);
  }
}

export function makeMockPatchAssetUC(appObjects: HostAppObjectRepo) {
  return new MockPatchAssetUC(appObjects.getOrCreate("MockPatchAssetUC"));
}
