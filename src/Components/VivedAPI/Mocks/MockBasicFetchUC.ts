import { HostAppObject, HostAppObjectRepo } from "../../../HostAppObject";
import { BasicFetchUC } from "../UCs/BasicFetchUC";

export class MockBasicFetchUC extends BasicFetchUC {
  doRequest = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, BasicFetchUC.type);
  }
}

export function makeMockBasicFetchUC(appObjects: HostAppObjectRepo) {
  return new MockBasicFetchUC(appObjects.getOrCreate("BasicFetchUC"));
}
