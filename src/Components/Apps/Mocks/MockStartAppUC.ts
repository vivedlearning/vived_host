import { AppObject } from "@vived/core";
import { StartAppUC } from "../UCs/StartAppUC";

export class MockStartAppUC extends StartAppUC {
  start = jest.fn();

  constructor(appObject: AppObject) {
    super(appObject, StartAppUC.type);
  }
}
