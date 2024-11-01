import { HostAppObject, HostAppObjectRepo } from "../../../HostAppObject";
import { EditAppAssetUC } from "../UCs/EditAppAssetUC";

export class MockEditAppAssetUC extends EditAppAssetUC {
  editAsset = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, EditAppAssetUC.type);
  }
}

export function makeMockEditAppAssetUC(appObjects: HostAppObjectRepo) {
  return new MockEditAppAssetUC(appObjects.getOrCreate("MockEditAppAssetUC"));
}
