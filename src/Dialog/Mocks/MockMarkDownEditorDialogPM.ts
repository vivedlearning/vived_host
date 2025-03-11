import { AppObject } from "@vived/core";
import { MarkDownEditorDialogPM } from "../PMs";

export class MockMarkDownEditorDialogPM extends MarkDownEditorDialogPM {
  vmsAreEqual = jest.fn();

  constructor(appObject: AppObject) {
    super(appObject, MarkDownEditorDialogPM.type);
  }
}
