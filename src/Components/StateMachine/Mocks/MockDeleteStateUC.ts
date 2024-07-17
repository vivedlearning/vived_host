import { HostAppObject, HostAppObjectRepo } from "../../../HostAppObject";
import { DeleteStateUC } from "../UCs";

export class MockDeleteStateUC extends DeleteStateUC {
  deleteState = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, DeleteStateUC.type);
  }
}

export function makeMockDeleteStateUC(appObjects: HostAppObjectRepo) {
  return new MockDeleteStateUC(appObjects.getOrCreate("MockDeleteStateUC"));
}
