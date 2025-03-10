import { AppObject, AppObjectRepo } from "@vived/core";
import { EditActiveStateUC } from "../UCs/EditActiveState/EditActiveStateUC";

export class MockEditActiveStateUC extends EditActiveStateUC {
  editActiveState = jest.fn();

  constructor(appObject: AppObject) {
    super(appObject, EditActiveStateUC.type);
  }
}

export function makeMockEditActiveStateUC(appObjects: AppObjectRepo) {
  return new MockEditActiveStateUC(
    appObjects.getOrCreate("MockEditActiveStateUC")
  );
}
