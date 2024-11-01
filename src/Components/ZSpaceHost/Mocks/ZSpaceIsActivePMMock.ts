import { HostAppObject, HostAppObjectRepo } from "../../../HostAppObject";
import { ZSpaceIsActivePM } from "../PMs";

export class ZSpaceIsActivePMMock extends ZSpaceIsActivePM {
  vmsAreEqual = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, ZSpaceIsActivePM.type);
  }
}

export function makeZSpaceIsActivePMMock(appObjects: HostAppObjectRepo) {
  return new ZSpaceIsActivePMMock(appObjects.getOrCreate("ZSpaceIsActivePMMock"))
}