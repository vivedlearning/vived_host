import { AppObject, AppObjectRepo } from "@vived/core";
import { GetAppFromAPIUC } from "../UCs/GetAppFromAPIUC";

export class MockGetAppFromAPIUC extends GetAppFromAPIUC {
  getApp = jest.fn();

  constructor(appObject: AppObject) {
    super(appObject, GetAppFromAPIUC.type);
  }
}

export function makeMockGetAppFromAPIUC(appObjects: AppObjectRepo) {
  return new MockGetAppFromAPIUC(appObjects.getOrCreate("MockGetAppFromAPIUC"));
}
