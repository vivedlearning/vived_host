import { HostAppObject, HostAppObjectRepo } from "../../../HostAppObject";
import { IsEditingStatePM } from "../PMs";

export class MockIsEditingStatePM extends IsEditingStatePM {
  vmsAreEqual = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, IsEditingStatePM.type);
  }
}

export function makeMockIsEditingStatePM(appObjects: HostAppObjectRepo) {
  return new MockIsEditingStatePM(
    appObjects.getOrCreate("MockIsEditingStatePM")
  );
}
