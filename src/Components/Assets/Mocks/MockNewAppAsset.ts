import { HostAppObject, HostAppObjectRepo } from "../../../HostAppObject";
import { NewAppAssetUC } from "../UCs/NewAppAssetUC";

export class MockNewAppAssetUC extends NewAppAssetUC {
  create = jest.fn().mockResolvedValue(undefined);

  constructor(appObject: HostAppObject) {
    super(appObject, NewAppAssetUC.type);
  }
}

export function makeMockNewAppAssetUC(appObjects: HostAppObjectRepo) {
  return new MockNewAppAssetUC(appObjects.getOrCreate("MockNewAppAssetUC"));
}
