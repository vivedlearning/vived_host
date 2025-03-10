import { AppObject } from "@vived/core";
import { AppPM } from "../PMs/AppPM";

export class MockAppPM extends AppPM {
  vmsAreEqual = jest.fn();

  constructor(appObject: AppObject) {
    super(appObject, AppPM.type);
  }
}
