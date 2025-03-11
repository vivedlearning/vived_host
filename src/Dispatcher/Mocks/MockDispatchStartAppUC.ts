import { AppObject } from "@vived/core";
import { DispatchStartAppUC } from "../UCs";

export class MockDispatchStartAppUC extends DispatchStartAppUC {
  doDispatch = jest.fn();

  constructor(appObject: AppObject) {
    super(appObject, DispatchStartAppUC.type);
  }
}
