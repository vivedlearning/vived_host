import { HostAppObject } from "../../../HostAppObject";
import { DispatchIsAuthoringUC } from "../UCs";


export class MockDispatchIsAuthoringUC extends DispatchIsAuthoringUC {
  doDispatch = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, DispatchIsAuthoringUC.type);
  }
}
