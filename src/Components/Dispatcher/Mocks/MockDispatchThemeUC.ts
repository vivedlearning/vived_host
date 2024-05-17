import { HostAppObject } from "../../../HostAppObject";
import { DispatchThemeUC } from "../UCs";


export class MockDispatchThemeUC extends DispatchThemeUC {
  doDispatch = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, DispatchThemeUC.type);
  }
}

