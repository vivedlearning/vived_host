import { AppObject, AppObjectRepo } from "@vived/core";
import { EditStateUC } from "../UCs/EditState/EditStateUC";

export class EditStateUCMock extends EditStateUC {
  edit = jest.fn();

  constructor(appObject: AppObject) {
    super(appObject, EditStateUC.type);
  }
}

export function makeEditStateUCMock(appObjects: AppObjectRepo) {
  return new EditStateUCMock(appObjects.getOrCreate("EditStateUCMock"));
}
