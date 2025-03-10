import { AppObject } from "@vived/core";
import { DispatchStopAppUC } from "../UCs";

export class MockDispatchStopAppUC extends DispatchStopAppUC {
  doDispatch = jest.fn();

  constructor(appObject: AppObject) {
    super(appObject, DispatchStopAppUC.type);
  }
}
