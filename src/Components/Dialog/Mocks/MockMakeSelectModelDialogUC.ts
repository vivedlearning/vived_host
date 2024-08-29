import { HostAppObject, HostAppObjectRepo } from "../../../HostAppObject";
import { MakeSelectModelDialogUC } from "../UCs/MakeSelectModelDialogUC";

export class MockMakeSelectModelDialogUC extends MakeSelectModelDialogUC {
  make = jest.fn();
  factory = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, MakeSelectModelDialogUC.type);
  }
}

export function makeMockMakeSelectModelDialogUC(appObjects: HostAppObjectRepo) {
  return new MockMakeSelectModelDialogUC(
    appObjects.getOrCreate("MockMakeSelectModelDialogUC")
  );
}
