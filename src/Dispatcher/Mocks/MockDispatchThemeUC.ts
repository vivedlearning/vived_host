import { AppObject } from "@vived/core";
import { DispatchThemeUC } from "../UCs";

export class MockDispatchThemeUC extends DispatchThemeUC {
  doDispatch = jest.fn();

  constructor(appObject: AppObject) {
    super(appObject, DispatchThemeUC.type);
  }
}
