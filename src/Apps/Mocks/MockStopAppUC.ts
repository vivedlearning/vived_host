import { AppObject } from "@vived/core";
import { StopAppUC } from "../UCs/StopAppUC";

export class MockStopAppUC extends StopAppUC {
  stop = jest.fn();

  constructor(appObject: AppObject) {
    super(appObject, StopAppUC.type);
  }
}
