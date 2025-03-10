import { AppObject, AppObjectRepo } from "@vived/core";
import { DevFeaturesEnabledPM } from "../PMs/DevFeaturesEnabledPM";

export class DevFeaturesEnabledPMMock extends DevFeaturesEnabledPM {
  vmsAreEqual = jest.fn();
  constructor(appObject: AppObject) {
    super(appObject, DevFeaturesEnabledPM.type);
  }
}

export function makeDevFeaturesEnabledPMMock(appObjects: AppObjectRepo) {
  return new DevFeaturesEnabledPMMock(
    appObjects.getOrCreate("DevFeaturesEnabledPMMock")
  );
}
