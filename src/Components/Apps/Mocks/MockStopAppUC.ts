import { HostAppObject } from "../../../HostAppObject";
import { StopAppUC } from "../UCs/StopAppUC";

export class MockStopAppUC extends StopAppUC {
  stop = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, StopAppUC.type);
  }
}
