import { HostAppObject, HostAppObjectRepo } from "../../../HostAppObject";
import { EditingStatePM } from "../PMs";

export class MockIsEditingStatePM extends EditingStatePM {
  vmsAreEqual = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, EditingStatePM.type);
  }
}

export function makeMockIsEditingStatePM(appObjects: HostAppObjectRepo) {
  return new MockIsEditingStatePM(
    appObjects.getOrCreate("MockIsEditingStatePM")
  );
}
