import { HostAppObject, HostAppObjectRepo } from "../../../HostAppObject";
import { AppsListPM } from "../PMs/AppsListPM";

export class MockAppsListPM extends AppsListPM {
  vmsAreEqual = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, AppsListPM.type);
  }
}

export function makeMockAppsListPM(appObjects: HostAppObjectRepo) {
  return new MockAppsListPM(appObjects.getOrCreate("MockAppsListPM"));
}
