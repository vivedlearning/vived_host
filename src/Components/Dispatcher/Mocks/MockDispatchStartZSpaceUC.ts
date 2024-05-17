import { HostAppObject } from "../../../HostAppObject";
import { DispatchStartZSpaceUC } from "../UCs";

export class MockDispatchStartZSpaceUC extends DispatchStartZSpaceUC {
  doDispatch = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, DispatchStartZSpaceUC.type);
  }
}

