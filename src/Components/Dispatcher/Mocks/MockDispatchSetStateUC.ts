import { AppObject } from "@vived/core";
import { DispatchSetStateUC } from "../UCs";

export class MockDispatchSetStateUC extends DispatchSetStateUC {
  doDispatch = jest.fn();

  constructor(appObject: AppObject) {
    super(appObject, DispatchSetStateUC.type);
  }
}
