import { HostAppObject, HostAppObjectRepo } from "../../../HostAppObject";
import { SaveAuthoringUC } from "../UCs/SaveAuthoring/SaveAuthoringUC";

export class MockSaveAuthoringUC extends SaveAuthoringUC {
  saveAuthoring = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, SaveAuthoringUC.type);
  }
}

export function makeMockSaveAuthoringUC(appObjects: HostAppObjectRepo) {
  return new MockSaveAuthoringUC(appObjects.getOrCreate("MockSaveAuthoringUC"));
}
