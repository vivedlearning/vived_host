import { HostAppObject, HostAppObjectRepo } from "../../../HostAppObject";
import { DuplicateStateUC } from "../UCs";

export class MockDuplicateStateUC extends DuplicateStateUC {
  duplicateState = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, DuplicateStateUC.type);
  }
}

export function makeMockDuplicateStateUC(appObjects: HostAppObjectRepo) {
  return new MockDuplicateStateUC(
    appObjects.getOrCreate("MockDuplicateStateUC")
  );
}
