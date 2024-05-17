import { HostAppObject } from "../../../HostAppObject";
import { DispatchShowBabylonInspectorUC } from "../UCs";

export class MockDispatchShowBabylonInspectorUC extends DispatchShowBabylonInspectorUC {
  doDispatch = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, DispatchShowBabylonInspectorUC.type);
  }
}

