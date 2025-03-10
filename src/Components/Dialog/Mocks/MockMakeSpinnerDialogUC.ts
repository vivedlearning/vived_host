import { AppObject, AppObjectRepo } from "@vived/core";
import { MakeSpinnerDialogUC } from "../UCs/MakeSpinnerDialogUC";

export class MockMakeSpinnerDialogUC extends MakeSpinnerDialogUC {
  make = jest.fn();
  factory = jest.fn();

  constructor(appObject: AppObject) {
    super(appObject, MakeSpinnerDialogUC.type);
  }
}

export function makeMockMakeSpinnerDialogUC(appObjects: AppObjectRepo) {
  return new MockMakeSpinnerDialogUC(
    appObjects.getOrCreate("MockMakeSpinnerDialogUC")
  );
}
