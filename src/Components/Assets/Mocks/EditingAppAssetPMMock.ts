import { HostAppObject, HostAppObjectRepo } from "../../../HostAppObject";
import { EditingAppAssetPM } from "../PMs/EditingAppAssetPM";

export class EditingAppAssetPMMock extends EditingAppAssetPM {
  vmsAreEqual = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, EditingAppAssetPM.type);
  }
}

export function makeEditingAppAssetPMMock(appObjects: HostAppObjectRepo) {
  return new EditingAppAssetPMMock(appObjects.getOrCreate("EditingAppAssetPMMock"));
}
