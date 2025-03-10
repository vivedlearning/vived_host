import { AppObject, AppObjectRepo } from "@vived/core";
import { BlobRequestUC } from "../UCs/BlobRequestUC";

export class MockBlobRequestUC extends BlobRequestUC {
  doRequest = jest.fn();

  constructor(appObject: AppObject) {
    super(appObject, MockBlobRequestUC.type);
  }
}

export function makeMockBlobRequestUC(appObjects: AppObjectRepo) {
  return new MockBlobRequestUC(appObjects.getOrCreate("MockBlobRequestUC"));
}
