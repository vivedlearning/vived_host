import { HostAppObject } from "../../../HostAppObject";
import { AlertDialogPM } from "../PMs";

export class MockAlertDialogPM extends AlertDialogPM {
  vmsAreEqual = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, AlertDialogPM.type);
  }
}
