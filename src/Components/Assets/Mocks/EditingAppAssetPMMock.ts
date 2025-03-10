import { AppObject, AppObjectRepo } from "@vived/core";
import { EditingAppAssetPM } from "../PMs/EditingAppAssetPM";

export class EditingAppAssetPMMock extends EditingAppAssetPM {
  vmsAreEqual = jest.fn();

  constructor(appObject: AppObject) {
    super(appObject, EditingAppAssetPM.type);
  }
}

export function makeEditingAppAssetPMMock(appObjects: AppObjectRepo) {
  return new EditingAppAssetPMMock(
    appObjects.getOrCreate("EditingAppAssetPMMock")
  );
}
