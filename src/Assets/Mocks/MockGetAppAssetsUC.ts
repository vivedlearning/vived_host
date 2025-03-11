import { AppObject, AppObjectRepo } from "@vived/core";
import { GetAppAssetsUC } from "../UCs/GetAppAssetsUC";

export class MockGetAppAssetsUC extends GetAppAssetsUC {
  getAppAssets = jest.fn();

  constructor(appObject: AppObject) {
    super(appObject, GetAppAssetsUC.type);
  }
}

export function makeMockGetAppAssetsUC(appObjects: AppObjectRepo) {
  return new MockGetAppAssetsUC(appObjects.getOrCreate("MockGetAppAssetsUC"));
}
