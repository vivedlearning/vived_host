import { HostAppObject, HostAppObjectRepo } from "../../../HostAppObject";
import { StartZSpaceUC } from "../UCs/StartZSpace/StartZSpaceUC";

export class MockStartZSpaceUC extends StartZSpaceUC {
  startZSpace = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, StartZSpaceUC.type);
  }
}

export function makeMockStartZSpaceUC(appObjects: HostAppObjectRepo) {
  return new MockStartZSpaceUC(appObjects.getOrCreate("MockStartZSpaceUC"));
}
