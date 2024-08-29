import { HostAppObject } from "../../../HostAppObject";
import { SpinnerDialogPM } from "../PMs";

export class MockSpinnerDialogPM extends SpinnerDialogPM {
  vmsAreEqual = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, SpinnerDialogPM.type);
  }
}
