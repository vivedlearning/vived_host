import { AppObject, AppObjectRepo } from "@vived/core";
import { EditingStatePM } from "../PMs/EditingStatePM";

export class MockIsEditingStatePM extends EditingStatePM {
  vmsAreEqual = jest.fn();

  constructor(appObject: AppObject) {
    super(appObject, EditingStatePM.type);
  }
}

export function makeMockIsEditingStatePM(appObjects: AppObjectRepo) {
  return new MockIsEditingStatePM(
    appObjects.getOrCreate("MockIsEditingStatePM")
  );
}
