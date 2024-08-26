import { HostAppObject, HostAppObjectRepo } from "../../../HostAppObject";
import { AssetPluginContainerUC } from "../UCs/AssetPluginContainerUC";

export class MockAssetPluginContainerUC extends AssetPluginContainerUC {
  setContainer = jest.fn();
  clearContainer = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, AssetPluginContainerUC.type);
  }
}

export function makeMockAssetPluginContainerUC(appObjects: HostAppObjectRepo) {
  return new MockAssetPluginContainerUC(
    appObjects.getOrCreate("MockAssetPluginContainerUC")
  );
}
