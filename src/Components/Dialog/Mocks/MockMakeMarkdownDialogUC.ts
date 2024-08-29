import { HostAppObject, HostAppObjectRepo } from "../../../HostAppObject";
import { MakeMarkdownDialogUC } from "../UCs/MakeMarkdownDialogUC";

export class MockMakeMarkdownDialogUC extends MakeMarkdownDialogUC {
  make = jest.fn();
  factory = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, MakeMarkdownDialogUC.type);
  }
}

export function makeMockMakeMarkdownDialogUC(appObjects: HostAppObjectRepo) {
  return new MockMakeMarkdownDialogUC(
    appObjects.getOrCreate("MockMakeMarkdownDialogUC")
  );
}
