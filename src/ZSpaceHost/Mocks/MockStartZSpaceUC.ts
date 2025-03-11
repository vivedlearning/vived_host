import { AppObject, AppObjectRepo } from "@vived/core";
import { StartZSpaceUC } from "../UCs/StartZSpace/StartZSpaceUC";

export class MockStartZSpaceUC extends StartZSpaceUC {
  startZSpace = jest.fn();

  constructor(appObject: AppObject) {
    super(appObject, StartZSpaceUC.type);
  }
}

export function makeMockStartZSpaceUC(appObjects: AppObjectRepo) {
  return new MockStartZSpaceUC(appObjects.getOrCreate("MockStartZSpaceUC"));
}
