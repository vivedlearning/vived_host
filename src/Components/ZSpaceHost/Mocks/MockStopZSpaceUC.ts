import { HostAppObject, HostAppObjectRepo } from "../../../HostAppObject";
import { StopZSpaceUC } from "../UCs/StopZSpace/StopZSpaceUC";

export class MockStopZSpaceUC extends StopZSpaceUC {
  stopZSpace = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, StopZSpaceUC.type);
  }
}

export function makeMockStopZSpaceUC(appObjects: HostAppObjectRepo) {
  return new MockStopZSpaceUC(appObjects.getOrCreate("MockStopZSpaceUC"));
}
