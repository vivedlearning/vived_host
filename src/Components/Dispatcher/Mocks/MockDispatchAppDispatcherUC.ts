import { HostAppObject } from "../../../HostAppObject";
import { DispatchAppDispatcherUC } from "../UCs";


export class MockDispatchAppDispatcherUC extends DispatchAppDispatcherUC {
  doDispatch = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, DispatchAppDispatcherUC.type);
  }
}

