import { AppObject, AppObjectRepo } from "@vived/core";
import { MakeConfirmDialogUC } from "../UCs/MakeConfirmDialogUC";

export class MockMakeConfirmDialogUC extends MakeConfirmDialogUC {
  make = jest.fn();
  factory = jest.fn();

  constructor(appObject: AppObject) {
    super(appObject, MakeConfirmDialogUC.type);
  }
}

export function makeMockMakeConfirmDialogUC(appObjects: AppObjectRepo) {
  return new MockMakeConfirmDialogUC(
    appObjects.getOrCreate("MockMakeConfirmDialogUC")
  );
}
