import { HostAppObject, HostAppObjectRepo } from "../../../HostAppObject";
import { DevFeaturesEnabledPM } from "../PMs/DevFeaturesEnabledPM";

export class DevFeaturesEnabledPMMock extends DevFeaturesEnabledPM {
  vmsAreEqual = jest.fn();
  constructor(appObject: HostAppObject) {
    super(appObject, DevFeaturesEnabledPM.type);
  }
}

export function makeDevFeaturesEnabledPMMock(appObjects: HostAppObjectRepo) {
  return new DevFeaturesEnabledPMMock(
    appObjects.getOrCreate("DevFeaturesEnabledPMMock")
  );
}
