import { AppObject, AppObjectRepo } from "@vived/core";
import { ActiveAppPM } from "../PMs/ActiveAppPM";

export class MockActiveAppPM extends ActiveAppPM {
  vmsAreEqual = jest.fn();

  constructor(appObject: AppObject) {
    super(appObject, ActiveAppPM.type);
  }
}

export function makeMockActiveAppPM(appObjects: AppObjectRepo) {
  return new MockActiveAppPM(appObjects.getOrCreate("MockActiveAppPM"));
}
