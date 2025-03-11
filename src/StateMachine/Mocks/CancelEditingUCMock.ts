import { AppObject, AppObjectRepo } from "@vived/core";
import { CancelEditingUC } from "../UCs/CancelEditing/CancelEditingUC";

export class CancelEditingUCMock extends CancelEditingUC {
  cancel = jest.fn();

  constructor(appObject: AppObject) {
    super(appObject, CancelEditingUC.type);
  }
}

export function makeCancelEditingUCMock(appObjects: AppObjectRepo) {
  return new CancelEditingUCMock(appObjects.getOrCreate("CancelEditingUCMock"));
}
