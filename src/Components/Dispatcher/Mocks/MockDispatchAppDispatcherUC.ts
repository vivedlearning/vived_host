import { HostAppObject } from "../../../HostAppObject";
import { DispatchDisposeAppUC } from "../UCs";

export class MockDispatchDisposeAppUC extends DispatchDisposeAppUC {
  doDispatch = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, DispatchDisposeAppUC.type);
  }
}
