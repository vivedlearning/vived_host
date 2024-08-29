import { HostAppObject } from "../../../HostAppObject";
import { ConfirmDialogPM } from "../PMs";

export class MockConfirmDialogPM extends ConfirmDialogPM {
  vmsAreEqual = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, ConfirmDialogPM.type);
  }
}
