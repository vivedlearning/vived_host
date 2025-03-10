import { AppObject } from "@vived/core";
import { ConfirmDialogPM } from "../PMs";

export class MockConfirmDialogPM extends ConfirmDialogPM {
  vmsAreEqual = jest.fn();

  constructor(appObject: AppObject) {
    super(appObject, ConfirmDialogPM.type);
  }
}
