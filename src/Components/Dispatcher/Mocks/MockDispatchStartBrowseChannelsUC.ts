import { HostAppObject } from "../../../HostAppObject";
import { DispatchStartBrowseChannelsUC } from "../UCs/DispatchStartBrowseChannelsUC";

export class MockDispatchStartBrowseChannelsUC extends DispatchStartBrowseChannelsUC {
  doDispatch = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, DispatchStartBrowseChannelsUC.type);
  }
}
