import { HostAppObject, HostAppObjectRepo } from "../../../HostAppObject";
import { HostStateMachinePM } from "../PMs/HostStateMachinePM";

export class MockHostStateMachinePM extends HostStateMachinePM {
  vmsAreEqual = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, HostStateMachinePM.type);
  }
}

export function makeMockHostStateMachinePM(appObjects: HostAppObjectRepo) {
  return new MockHostStateMachinePM(
    appObjects.getOrCreate("MockHostStateMachinePM")
  );
}
