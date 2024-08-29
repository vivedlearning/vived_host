import { HostAppObject, HostAppObjectRepo } from "../../../HostAppObject";
import { MakeConfirmDialogUC } from "../UCs/MakeConfirmDialogUC";

export class MockMakeConfirmDialogUC extends MakeConfirmDialogUC {
  make = jest.fn();
  factory = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, MakeConfirmDialogUC.type);
  }
}

export function makeMockMakeConfirmDialogUC(appObjects: HostAppObjectRepo) {
  return new MockMakeConfirmDialogUC(
    appObjects.getOrCreate("MockMakeConfirmDialogUC")
  );
}
