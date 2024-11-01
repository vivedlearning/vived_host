import { HostAppObject, HostAppObjectRepo } from "../../../HostAppObject";
import { EmulateZSpacePM } from "../PMs";

export class EmulateZSpacePMMock extends EmulateZSpacePM {
  vmsAreEqual = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, EmulateZSpacePM.type);
  }
}

export function makeEmulateZSpacePMMock(appObjects: HostAppObjectRepo) {
  return new EmulateZSpacePMMock(appObjects.getOrCreate("EmulateZSpacePMMock"));
}
