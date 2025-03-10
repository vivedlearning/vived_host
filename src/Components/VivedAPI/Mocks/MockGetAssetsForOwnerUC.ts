import { AppObject, AppObjectRepo } from "@vived/core";
import { GetAssetsForOwnerFromAPIUC } from "../UCs/GetAssetsForOwnerFromAPIUC";

export class MockGetAssetsForOwnerFromAPIUC extends GetAssetsForOwnerFromAPIUC {
  getAssets = jest.fn();

  constructor(appObject: AppObject) {
    super(appObject, GetAssetsForOwnerFromAPIUC.type);
  }
}

export function makeMockGetAssetsForOwnerFromAPIUC(appObjects: AppObjectRepo) {
  return new MockGetAssetsForOwnerFromAPIUC(
    appObjects.getOrCreate("MockGetAssetsForOwnerFromAPIUC")
  );
}
