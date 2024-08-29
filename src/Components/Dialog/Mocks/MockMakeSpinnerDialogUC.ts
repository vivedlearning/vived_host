import { HostAppObject, HostAppObjectRepo } from "../../../HostAppObject";
import { MakeSpinnerDialogUC } from "../UCs/MakeSpinnerDialogUC";

export class MockMakeSpinnerDialogUC extends MakeSpinnerDialogUC {
  make = jest.fn();
  factory = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, MakeSpinnerDialogUC.type);
  }
}

export function makeMockMakeSpinnerDialogUC(appObjects: HostAppObjectRepo) {
  return new MockMakeSpinnerDialogUC(
    appObjects.getOrCreate("MockMakeSpinnerDialogUC")
  );
}
