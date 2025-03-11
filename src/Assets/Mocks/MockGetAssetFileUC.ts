import { AppObject, AppObjectRepo } from "@vived/core";
import { GetAssetFileUC } from "../UCs/GetAssetFileUC";

export class MockGetAssetFileUC extends GetAssetFileUC {
  getAssetFile = jest.fn();

  constructor(appObject: AppObject) {
    super(appObject, GetAssetFileUC.type);
  }
}

export function makeMockGetAssetFileUC(appObjects: AppObjectRepo) {
  return new MockGetAssetFileUC(appObjects.getOrCreate("MockGetAssetFileUC"));
}
