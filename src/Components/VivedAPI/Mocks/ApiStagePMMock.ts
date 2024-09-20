import { HostAppObject, HostAppObjectRepo } from "../../../HostAppObject";
import { ApiStagePM } from "../PMs/ApiStagePM";

export class ApiStagePMMock extends ApiStagePM {
  vmsAreEqual = jest.fn();
  constructor(appObject: HostAppObject) {
    super(appObject, ApiStagePM.type);
  }
}

export function makeApiStagePMMock(appObjects: HostAppObjectRepo) {
  return new ApiStagePMMock(appObjects.getOrCreate("ApiStagePMMock"));
}
