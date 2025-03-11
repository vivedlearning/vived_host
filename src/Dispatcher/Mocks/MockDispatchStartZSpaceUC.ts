import { AppObject } from "@vived/core";
import { DispatchStartZSpaceUC } from "../UCs";

export class MockDispatchStartZSpaceUC extends DispatchStartZSpaceUC {
  doDispatch = jest.fn();

  constructor(appObject: AppObject) {
    super(appObject, DispatchStartZSpaceUC.type);
  }
}
