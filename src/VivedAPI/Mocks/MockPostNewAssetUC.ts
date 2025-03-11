import { AppObject, AppObjectRepo } from "@vived/core";
import { PostNewAssetUC } from "../UCs/PostNewAssetUC";

export class MockPostNewAssetUC extends PostNewAssetUC {
  doPost = jest.fn().mockResolvedValue({
    id: "newAssetID",
    filename: "newAssetFile.name"
  });

  constructor(appObject: AppObject) {
    super(appObject, PostNewAssetUC.type);
  }
}

export function makeMockPostNewAssetUC(appObjects: AppObjectRepo) {
  return new MockPostNewAssetUC(appObjects.getOrCreate("MockPostNewAssetUC"));
}
