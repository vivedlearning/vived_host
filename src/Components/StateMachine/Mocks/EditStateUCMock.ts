import { HostAppObject, HostAppObjectRepo } from "../../../HostAppObject";
import { EditStateUC } from "../UCs/EditStateUC";

export class EditStateUCMock extends EditStateUC {
  edit = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, EditStateUC.type);
  }
}

export function makeEditStateUCMock(appObjects: HostAppObjectRepo) {
  return new EditStateUCMock(appObjects.getOrCreate("EditStateUCMock"));
}
