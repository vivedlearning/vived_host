import { HostAppObject, HostAppObjectRepo } from "../../../HostAppObject";
import { GetAssetUC } from "../UCs/GetAssetUC";

export class MockGetAssetUC extends GetAssetUC {
  getAsset = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, GetAssetUC.type);
  }
}

export function makeMockGetAssetUC(appObjects: HostAppObjectRepo) {
  return new MockGetAssetUC(appObjects.getOrCreate("MockGetAssetUC"));
}
