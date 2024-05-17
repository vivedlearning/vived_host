import { HostAppObject } from "../../../HostAppObject";
import { DispatchSetStateUC } from "../UCs";

export class MockDispatchSetStateUC extends DispatchSetStateUC {
  doDispatch = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, DispatchSetStateUC.type);
  }
}

