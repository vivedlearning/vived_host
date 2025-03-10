import { AppObject, AppObjectRepo } from "@vived/core";
import { DeleteStateUC } from "../UCs/DeleteStateUC";

export class MockDeleteStateUC extends DeleteStateUC {
  deleteState = jest.fn();

  constructor(appObject: AppObject) {
    super(appObject, DeleteStateUC.type);
  }
}

export function makeMockDeleteStateUC(appObjects: AppObjectRepo) {
  return new MockDeleteStateUC(appObjects.getOrCreate("MockDeleteStateUC"));
}
