import { AppObject, AppObjectRepo } from "@vived/core";
import { SaveAuthoringUC } from "../UCs/SaveAuthoring/SaveAuthoringUC";

export class MockSaveAuthoringUC extends SaveAuthoringUC {
  saveAuthoring = jest.fn();

  constructor(appObject: AppObject) {
    super(appObject, SaveAuthoringUC.type);
  }
}

export function makeMockSaveAuthoringUC(appObjects: AppObjectRepo) {
  return new MockSaveAuthoringUC(appObjects.getOrCreate("MockSaveAuthoringUC"));
}
