import { HostAppObject } from "../../../HostAppObject";
import { StartAppUC } from "../UCs/StartAppUC";

export class MockStartAppUC extends StartAppUC {
  start = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, StartAppUC.type);
  }
}
