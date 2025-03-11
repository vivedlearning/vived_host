import { AppObject, AppObjectRepo } from "@vived/core";
import { HostStateMachinePM } from "../PMs/HostStateMachinePM";

export class MockHostStateMachinePM extends HostStateMachinePM {
  vmsAreEqual = jest.fn();

  constructor(appObject: AppObject) {
    super(appObject, HostStateMachinePM.type);
  }
}

export function makeMockHostStateMachinePM(appObjects: AppObjectRepo) {
  return new MockHostStateMachinePM(
    appObjects.getOrCreate("MockHostStateMachinePM")
  );
}
