import { AppObject, AppObjectRepo } from "@vived/core";
import { AssetPluginPM } from "../PM/AssetPluginPM";

export class MockAssetPluginPM extends AssetPluginPM {
  vmsAreEqual = jest.fn();

  constructor(appObject: AppObject) {
    super(appObject, AssetPluginPM.type);
  }
}

export function makeMockAssetPluginPM(appObjects: AppObjectRepo) {
  return new MockAssetPluginPM(appObjects.getOrCreate("MockAssetPluginPM"));
}
