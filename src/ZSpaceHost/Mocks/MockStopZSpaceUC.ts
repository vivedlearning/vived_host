import { AppObject, AppObjectRepo } from "@vived/core";
import { StopZSpaceUC } from "../UCs/StopZSpace/StopZSpaceUC";

export class MockStopZSpaceUC extends StopZSpaceUC {
  stopZSpace = jest.fn();

  constructor(appObject: AppObject) {
    super(appObject, StopZSpaceUC.type);
  }
}

export function makeMockStopZSpaceUC(appObjects: AppObjectRepo) {
  return new MockStopZSpaceUC(appObjects.getOrCreate("MockStopZSpaceUC"));
}
