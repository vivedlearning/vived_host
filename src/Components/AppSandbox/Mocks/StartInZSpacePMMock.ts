import { HostAppObject, HostAppObjectRepo } from "../../../HostAppObject";
import { StartInZSpacePM } from "../PMs/StartInZSpacePM";

export class StartInZSpacePMMock extends StartInZSpacePM {
  vmsAreEqual = jest.fn();
  constructor(appObject: HostAppObject) {
    super(appObject, StartInZSpacePM.type);
  }
}

export function makeStartInZSpacePMMock(appObjects: HostAppObjectRepo) {
  return new StartInZSpacePMMock(appObjects.getOrCreate("StartInZSpacePMMock"));
}
