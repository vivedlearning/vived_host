import { HostAppObject } from "../../../HostAppObject";
import { DispatchEnableFeatureUC } from "../UCs";


export class DispatchEnableFeatureUCMock extends DispatchEnableFeatureUC {
  doDispatch = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, DispatchEnableFeatureUC.type);
  }
}
