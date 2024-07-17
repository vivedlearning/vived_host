import { HostAppObject, HostAppObjectRepo } from "../../../HostAppObject";
import { HostStateMachinePM, HostStateMachineVM } from "../PMs";

export class MockHostStateMachinePM extends HostStateMachinePM {
  vmsAreEqual = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, HostStateMachinePM.type);
  }
}

export function makeMockDuplicateStateUC(appObjects: HostAppObjectRepo) {
  return new MockHostStateMachinePM(
    appObjects.getOrCreate("MockHostStateMachinePM")
  );
}
