import { AppObject } from "@vived/core";
import { DispatchDisposeAppUC } from "../UCs";

export class MockDispatchDisposeAppUC extends DispatchDisposeAppUC {
  doDispatch = jest.fn();

  constructor(appObject: AppObject) {
    super(appObject, DispatchDisposeAppUC.type);
  }
}
