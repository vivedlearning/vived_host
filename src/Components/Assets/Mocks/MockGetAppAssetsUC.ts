import { HostAppObject, HostAppObjectRepo } from "../../../HostAppObject";
import { GetAppAssetsUC } from "../UCs/GetAppAssetsUC";

export class MockGetAppAssetsUC extends GetAppAssetsUC {
  getAppAssets = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, GetAppAssetsUC.type);
  }
}

export function makeMockGetAppAssetsUC(appObjects: HostAppObjectRepo) {
  return new MockGetAppAssetsUC(appObjects.getOrCreate("MockGetAppAssetsUC"));
}
