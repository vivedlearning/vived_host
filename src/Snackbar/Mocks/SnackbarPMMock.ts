import { AppObject, AppObjectRepo } from "@vived/core";
import { SnackbarPM } from "../PMs/SnackbarPM";

export class SnackbarPMMock extends SnackbarPM {
  vmsAreEqual = () => {
    return true;
  };

  constructor(appObject: AppObject) {
    super(appObject, SnackbarPM.type);
  }
}

export function makeSnackbarPMMock(appObjects: AppObjectRepo) {
  return new SnackbarPMMock(appObjects.getOrCreate("SnackbarPMMock"));
}
