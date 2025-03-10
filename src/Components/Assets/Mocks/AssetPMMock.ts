import { AppObject } from "@vived/core";
import { AssetPM } from "../PMs/AssetPM";

export class AssetPMMock extends AssetPM {
  vmsAreEqual = jest.fn();

  constructor(appObject: AppObject) {
    super(appObject, AssetPM.type);
  }
}
