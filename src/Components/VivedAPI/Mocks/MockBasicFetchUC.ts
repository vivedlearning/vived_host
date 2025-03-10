import { AppObject, AppObjectRepo } from "@vived/core";
import { BasicFetchUC } from "../UCs/BasicFetchUC";

export class MockBasicFetchUC extends BasicFetchUC {
  doRequest = jest.fn();

  constructor(appObject: AppObject) {
    super(appObject, BasicFetchUC.type);
  }
}

export function makeMockBasicFetchUC(appObjects: AppObjectRepo) {
  return new MockBasicFetchUC(appObjects.getOrCreate("BasicFetchUC"));
}
