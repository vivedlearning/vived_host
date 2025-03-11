import { AppObject, AppObjectRepo } from "@vived/core";
import { DialogQueuePM } from "../PMs";

export class MockDialogQueuePM extends DialogQueuePM {
  vmsAreEqual = jest.fn();

  constructor(appObject: AppObject) {
    super(appObject, DialogQueuePM.type);
  }
}

export function makeMockDialogQueuePM(appObjects: AppObjectRepo) {
  return new MockDialogQueuePM(appObjects.getOrCreate("MockDialogQueuePM"));
}
