import { HostAppObject, HostAppObjectRepo } from "../../../HostAppObject";
import { DialogQueuePM } from "../PMs";

export class MockDialogQueuePM extends DialogQueuePM {
  vmsAreEqual = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, DialogQueuePM.type);
  }
}

export function makeMockDialogQueuePM(appObjects: HostAppObjectRepo) {
  return new MockDialogQueuePM(appObjects.getOrCreate("MockDialogQueuePM"));
}
