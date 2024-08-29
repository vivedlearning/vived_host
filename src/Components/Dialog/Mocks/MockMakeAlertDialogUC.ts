import { HostAppObject, HostAppObjectRepo } from "../../../HostAppObject";
import { MakeAlertDialogUC } from "../UCs/MakeAlertDialogUC";

export class MockMakeAlertDialogUC extends MakeAlertDialogUC {
  make = jest.fn();
  factory = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, MakeAlertDialogUC.type);
  }
}

export function makeMockMakeAlertDialogUC(appObjects: HostAppObjectRepo) {
  return new MockMakeAlertDialogUC(
    appObjects.getOrCreate("MockMakeAlertDialogUC")
  );
}
