import { AppObject, AppObjectRepo } from "@vived/core";
import { ShowArchivedAppAssetPM } from "../PMs/ShowArchivedAppAssetPM";

export class ShowArchivedAppAssetPMMock extends ShowArchivedAppAssetPM {
  vmsAreEqual = jest.fn();

  constructor(appObject: AppObject) {
    super(appObject, ShowArchivedAppAssetPM.type);
  }
}

export function makeShowArchivedAppAssetPMMock(appObjects: AppObjectRepo) {
  return new ShowArchivedAppAssetPMMock(
    appObjects.getOrCreate("ShowArchivedAppAssetPMMock")
  );
}
