import { HostAppObject } from "../../../HostAppObject";
import { DispatchStopZSpaceUC } from "../UCs";

export class MockDispatchStopZSpaceUC extends DispatchStopZSpaceUC {
  doDispatch = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, DispatchStopZSpaceUC.type);
  }
}

