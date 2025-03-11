import { AppObject } from "@vived/core";
import { DispatchEnableFeatureUC } from "../UCs";

export class DispatchEnableFeatureUCMock extends DispatchEnableFeatureUC {
  doDispatch = jest.fn();

  constructor(appObject: AppObject) {
    super(appObject, DispatchEnableFeatureUC.type);
  }
}
