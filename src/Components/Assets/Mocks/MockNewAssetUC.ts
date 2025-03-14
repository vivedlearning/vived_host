import { HostAppObject, HostAppObjectRepo } from "../../../HostAppObject";
import { NewAssetUC } from "../UCs/NewAssetUC";

export class MockNewAssetUC extends NewAssetUC {
  create = jest.fn().mockResolvedValue('newAssetID');

  constructor(appObject: HostAppObject) {
    super(appObject, NewAssetUC.type);
  }
}

export function makeMockNewAssetUC(appObjects: HostAppObjectRepo) {
  return new MockNewAssetUC(appObjects.getOrCreate("MockNewAssetUC"));
}
