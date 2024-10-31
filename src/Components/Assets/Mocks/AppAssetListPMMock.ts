import { HostAppObject, HostAppObjectRepo } from "../../../HostAppObject";
import { AppAssetListPM } from "../PMs";

export class AppAssetListPMMock extends AppAssetListPM {
  vmsAreEqual = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, AppAssetListPM.type);
  }
}

export function makeAppAssetListPMMock(appObjects: HostAppObjectRepo) {
  return new AppAssetListPMMock(appObjects.getOrCreate("AppAssetListPMMock"));
}
