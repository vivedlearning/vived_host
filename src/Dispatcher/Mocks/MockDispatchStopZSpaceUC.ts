import { AppObject } from "@vived/core";
import { DispatchStopZSpaceUC } from "../UCs";

export class MockDispatchStopZSpaceUC extends DispatchStopZSpaceUC {
  doDispatch = jest.fn();

  constructor(appObject: AppObject) {
    super(appObject, DispatchStopZSpaceUC.type);
  }
}
