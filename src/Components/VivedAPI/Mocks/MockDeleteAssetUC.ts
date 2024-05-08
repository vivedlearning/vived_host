import { HostAppObject, HostAppObjectRepo } from "../../../HostAppObject";
import { DeleteAssetUC } from "../UCs/DeleteAssetUC";

export class MockDeleteAssetUC extends DeleteAssetUC {
  doDelete = jest.fn().mockResolvedValue(undefined);

  constructor(appObject: HostAppObject) {
    super(appObject, DeleteAssetUC.type);
  }
}

export function makeMockDeleteAssetUC(appObjects: HostAppObjectRepo) {
  return new MockDeleteAssetUC(appObjects.getOrCreate("MockDeleteAssetUC"));
}
