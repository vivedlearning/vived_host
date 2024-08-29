import { HostAppObject } from "../../../HostAppObject";
import { MarkDownEditorDialogPM } from "../PMs";

export class MockMarkDownEditorDialogPM extends MarkDownEditorDialogPM {
  vmsAreEqual = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, MarkDownEditorDialogPM.type);
  }
}
