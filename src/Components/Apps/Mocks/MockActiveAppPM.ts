import { HostAppObject, HostAppObjectRepo } from "../../../HostAppObject";
import { ActiveAppPM } from "../PMs/ActiveAppPM";

export class MockActiveAppPM extends ActiveAppPM {
  vmsAreEqual = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, ActiveAppPM.type);
  }
}

export function makeMockActiveAppPM(appObjects: HostAppObjectRepo) {
  return new MockActiveAppPM(appObjects.getOrCreate("MockActiveAppPM"));
}
