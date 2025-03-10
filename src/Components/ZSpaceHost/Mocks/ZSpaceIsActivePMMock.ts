import { AppObject, AppObjectRepo } from "@vived/core";
import { ZSpaceIsActivePM } from "../PMs";

export class ZSpaceIsActivePMMock extends ZSpaceIsActivePM {
  vmsAreEqual = jest.fn();

  constructor(appObject: AppObject) {
    super(appObject, ZSpaceIsActivePM.type);
  }
}

export function makeZSpaceIsActivePMMock(appObjects: AppObjectRepo) {
  return new ZSpaceIsActivePMMock(
    appObjects.getOrCreate("ZSpaceIsActivePMMock")
  );
}
