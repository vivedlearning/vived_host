import { AppObject } from "@vived/core";
import { AlertDialogPM } from "../PMs";

export class MockAlertDialogPM extends AlertDialogPM {
  vmsAreEqual = jest.fn();

  constructor(appObject: AppObject) {
    super(appObject, AlertDialogPM.type);
  }
}
