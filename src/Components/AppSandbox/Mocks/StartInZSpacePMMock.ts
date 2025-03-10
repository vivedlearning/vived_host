import { AppObject, AppObjectRepo } from "@vived/core";
import { StartInZSpacePM } from "../PMs/StartInZSpacePM";

export class StartInZSpacePMMock extends StartInZSpacePM {
  vmsAreEqual = jest.fn();
  constructor(appObject: AppObject) {
    super(appObject, StartInZSpacePM.type);
  }
}

export function makeStartInZSpacePMMock(appObjects: AppObjectRepo) {
  return new StartInZSpacePMMock(appObjects.getOrCreate("StartInZSpacePMMock"));
}
