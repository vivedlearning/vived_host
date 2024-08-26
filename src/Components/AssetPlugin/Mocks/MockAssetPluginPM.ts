import { HostAppObject, HostAppObjectRepo } from "../../../HostAppObject";
import { AssetPluginPM } from "../PM/AssetPluginPM";

export class MockAssetPluginPM extends AssetPluginPM {
  vmsAreEqual = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, AssetPluginPM.type);
  }
}

export function makeMockAssetPluginPM(appObjects: HostAppObjectRepo) {
  return new MockAssetPluginPM(appObjects.getOrCreate("MockAssetPluginPM"));
}
