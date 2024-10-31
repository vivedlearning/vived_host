import { HostAppObject } from "../../../HostAppObject";
import { AssetPM } from "../PMs/AssetPM";

export class AssetPMMock extends AssetPM {
  vmsAreEqual = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, AssetPM.type);
  }
}
