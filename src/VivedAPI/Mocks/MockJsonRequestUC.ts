import { AppObject, AppObjectRepo } from "@vived/core";
import { JsonRequestUC } from "../UCs/JsonRequestUC";

export class MockJsonRequestUC extends JsonRequestUC {
  doRequest = jest.fn();

  constructor(appObject: AppObject) {
    super(appObject, JsonRequestUC.type);
  }
}

export function makeMockJsonRequestUC(appObjects: AppObjectRepo) {
  return new MockJsonRequestUC(appObjects.getOrCreate("MockJsonRequestUC"));
}
