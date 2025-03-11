import { AppObject, AppObjectRepo } from "@vived/core";
import { AppsListPM } from "../PMs/AppsListPM";

export class MockAppsListPM extends AppsListPM {
  vmsAreEqual = jest.fn();

  constructor(appObject: AppObject) {
    super(appObject, AppsListPM.type);
  }
}

export function makeMockAppsListPM(appObjects: AppObjectRepo) {
  return new MockAppsListPM(appObjects.getOrCreate("MockAppsListPM"));
}
