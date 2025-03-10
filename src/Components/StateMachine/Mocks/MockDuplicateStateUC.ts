import { AppObject, AppObjectRepo } from "@vived/core";
import { DuplicateStateUC } from "../UCs/DuplicateStateUC";

export class MockDuplicateStateUC extends DuplicateStateUC {
  duplicateState = jest.fn();

  constructor(appObject: AppObject) {
    super(appObject, DuplicateStateUC.type);
  }
}

export function makeMockDuplicateStateUC(appObjects: AppObjectRepo) {
  return new MockDuplicateStateUC(
    appObjects.getOrCreate("MockDuplicateStateUC")
  );
}
