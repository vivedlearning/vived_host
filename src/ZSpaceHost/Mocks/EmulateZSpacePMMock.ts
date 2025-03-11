import { AppObject, AppObjectRepo } from "@vived/core";
import { EmulateZSpacePM } from "../PMs";

export class EmulateZSpacePMMock extends EmulateZSpacePM {
  vmsAreEqual = jest.fn();

  constructor(appObject: AppObject) {
    super(appObject, EmulateZSpacePM.type);
  }
}

export function makeEmulateZSpacePMMock(appObjects: AppObjectRepo) {
  return new EmulateZSpacePMMock(appObjects.getOrCreate("EmulateZSpacePMMock"));
}
