import { HostAppObject, HostAppObjectRepo } from "../../../HostAppObject";
import { GetAssetsForOwnerUC } from "../UCs/GetAssetsForOwnerUC";

export class MockGetAssetsForOwnerUC extends GetAssetsForOwnerUC {
  getAssets = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, GetAssetsForOwnerUC.type);
  }
}

export function makeMockGetAssetsForOwnerUC(appObjects: HostAppObjectRepo) {
  return new MockGetAssetsForOwnerUC(
    appObjects.getOrCreate("MockGetAssetsForOwnerUC")
  );
}
