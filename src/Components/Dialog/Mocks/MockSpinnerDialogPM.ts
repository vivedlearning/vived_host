import { AppObject } from "@vived/core";
import { SpinnerDialogPM } from "../PMs";

export class MockSpinnerDialogPM extends SpinnerDialogPM {
  vmsAreEqual = jest.fn();

  constructor(appObject: AppObject) {
    super(appObject, SpinnerDialogPM.type);
  }
}
