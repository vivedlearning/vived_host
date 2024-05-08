import { HostAppObject, HostAppObjectRepo } from "../../../HostAppObject";
import { JsonRequestUC } from "../UCs/JsonRequestUC";

export class MockJsonRequestUC extends JsonRequestUC {
  doRequest = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, JsonRequestUC.type);
  }
}

export function makeMockJsonRequestUC(appObjects: HostAppObjectRepo) {
  return new MockJsonRequestUC(appObjects.getOrCreate("MockJsonRequestUC"));
}
