import { HostAppObject, HostAppObjectRepo } from "../../../HostAppObject";
import { CancelEditingUC } from "../UCs/CancelEditing/CancelEditingUC";

export class CancelEditingUCMock extends CancelEditingUC {
  cancel = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, CancelEditingUC.type);
  }
}

export function makeCancelEditingUCMock(appObjects: HostAppObjectRepo) {
  return new CancelEditingUCMock(appObjects.getOrCreate("CancelEditingUCMock"));
}
