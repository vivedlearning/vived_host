import { AppObject } from "@vived/core";
import { DispatchStartBrowseChannelsUC } from "../UCs/DispatchStartBrowseChannelsUC";

export class MockDispatchStartBrowseChannelsUC extends DispatchStartBrowseChannelsUC {
  doDispatch = jest.fn();

  constructor(appObject: AppObject) {
    super(appObject, DispatchStartBrowseChannelsUC.type);
  }
}
