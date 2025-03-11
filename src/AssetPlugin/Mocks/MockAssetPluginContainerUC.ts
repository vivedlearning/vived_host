import { AppObject, AppObjectRepo } from "@vived/core";
import { AssetPluginContainerUC } from "../UCs/AssetPluginContainerUC";

export class MockAssetPluginContainerUC extends AssetPluginContainerUC {
  setContainer = jest.fn();
  clearContainer = jest.fn();

  constructor(appObject: AppObject) {
    super(appObject, AssetPluginContainerUC.type);
  }
}

export function makeMockAssetPluginContainerUC(appObjects: AppObjectRepo) {
  return new MockAssetPluginContainerUC(
    appObjects.getOrCreate("MockAssetPluginContainerUC")
  );
}
