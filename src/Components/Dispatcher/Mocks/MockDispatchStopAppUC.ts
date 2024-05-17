import { HostAppObject } from "../../../HostAppObject";
import { DispatchStopAppUC } from "../UCs";

export class MockDispatchStopAppUC extends DispatchStopAppUC {
  doDispatch = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, DispatchStopAppUC.type);
  }
}

