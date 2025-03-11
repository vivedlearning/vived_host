import { AppObject, AppObjectRepo } from "@vived/core";
import { AppAssetListPM } from "../PMs";

export class AppAssetListPMMock extends AppAssetListPM {
  vmsAreEqual = jest.fn();

  constructor(appObject: AppObject) {
    super(appObject, AppAssetListPM.type);
  }
}

export function makeAppAssetListPMMock(appObjects: AppObjectRepo) {
  return new AppAssetListPMMock(appObjects.getOrCreate("AppAssetListPMMock"));
}
