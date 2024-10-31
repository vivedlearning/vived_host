import { HostAppObject, HostAppObjectRepo } from "../../../HostAppObject";
import { ShowArchivedAppAssetPM } from "../PMs/ShowArchivedAppAssetPM";

export class ShowArchivedAppAssetPMMock extends ShowArchivedAppAssetPM {
  vmsAreEqual = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, ShowArchivedAppAssetPM.type);
  }
}

export function makeShowArchivedAppAssetPMMock(appObjects: HostAppObjectRepo) {
  return new ShowArchivedAppAssetPMMock(appObjects.getOrCreate("ShowArchivedAppAssetPMMock"));
}
