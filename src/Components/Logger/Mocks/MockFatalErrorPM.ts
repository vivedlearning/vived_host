import { AppObject, AppObjectRepo } from "@vived/core";
import { FatalErrorPM, FatalErrorVM } from "../PMs/FatalErrorPM";

export class MockFatalErrorPM extends FatalErrorPM {
  vmsAreEqual = jest.fn();

  constructor(appObject: AppObject) {
    super(appObject, FatalErrorPM.type);
  }
}

export function makeMockFatalErrorPM(appObjects: AppObjectRepo) {
  return new MockFatalErrorPM(appObjects.getOrCreate("MockFatalErrorPM"));
}
