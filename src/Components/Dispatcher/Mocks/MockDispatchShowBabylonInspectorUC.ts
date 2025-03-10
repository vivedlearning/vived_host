import { AppObject } from "@vived/core";
import { DispatchShowBabylonInspectorUC } from "../UCs";

export class MockDispatchShowBabylonInspectorUC extends DispatchShowBabylonInspectorUC {
  doDispatch = jest.fn();

  constructor(appObject: AppObject) {
    super(appObject, DispatchShowBabylonInspectorUC.type);
  }
}
