import { AppObject, AppObjectRepo } from "@vived/core";
import { MakeAlertDialogUC } from "../UCs/MakeAlertDialogUC";

export class MockMakeAlertDialogUC extends MakeAlertDialogUC {
  make = jest.fn();
  factory = jest.fn();

  constructor(appObject: AppObject) {
    super(appObject, MakeAlertDialogUC.type);
  }
}

export function makeMockMakeAlertDialogUC(appObjects: AppObjectRepo) {
  return new MockMakeAlertDialogUC(
    appObjects.getOrCreate("MockMakeAlertDialogUC")
  );
}
