import { AppObject, AppObjectRepo } from "@vived/core";
import { ApiStagePM } from "../PMs/ApiStagePM";

export class ApiStagePMMock extends ApiStagePM {
  vmsAreEqual = jest.fn();
  constructor(appObject: AppObject) {
    super(appObject, ApiStagePM.type);
  }
}

export function makeApiStagePMMock(appObjects: AppObjectRepo) {
  return new ApiStagePMMock(appObjects.getOrCreate("ApiStagePMMock"));
}
