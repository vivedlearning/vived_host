import { HostAppObject } from "../../../HostAppObject";
import { DispatchStartAppUC } from "../UCs";

export class MockDispatchStartAppUC extends DispatchStartAppUC {
  doDispatch = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, DispatchStartAppUC.type);
  }
}

