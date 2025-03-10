import { AppObject, AppObjectRepo } from "@vived/core";
import { MakeSelectModelDialogUC } from "../UCs/MakeSelectModelDialogUC";

export class MockMakeSelectModelDialogUC extends MakeSelectModelDialogUC {
  make = jest.fn();
  factory = jest.fn();

  constructor(appObject: AppObject) {
    super(appObject, MakeSelectModelDialogUC.type);
  }
}

export function makeMockMakeSelectModelDialogUC(appObjects: AppObjectRepo) {
  return new MockMakeSelectModelDialogUC(
    appObjects.getOrCreate("MockMakeSelectModelDialogUC")
  );
}
