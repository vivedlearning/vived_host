import { HostAppObject, HostAppObjectRepo } from "../../../HostAppObject";
import { FatalErrorPM, FatalErrorVM } from "../PMs/FatalErrorPM";

export class MockFatalErrorPM extends FatalErrorPM {
  vmsAreEqual = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, FatalErrorPM.type);
  }
}

export function makeMockFatalErrorPM(appObjects: HostAppObjectRepo) {
  return new MockFatalErrorPM(appObjects.getOrCreate("MockFatalErrorPM"));
}
