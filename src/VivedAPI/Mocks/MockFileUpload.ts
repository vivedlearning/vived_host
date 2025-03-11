import { AppObject, AppObjectRepo } from "@vived/core";
import { FileUploadUC } from "../UCs/FileUploadUC";

export class MockFileUploadUC extends FileUploadUC {
  doUpload = jest.fn().mockResolvedValue(undefined);

  constructor(appObject: AppObject) {
    super(appObject, FileUploadUC.type);
  }
}

export function makeMockFileUploadUC(appObjects: AppObjectRepo) {
  return new MockFileUploadUC(appObjects.getOrCreate("MockFileUploadUC"));
}
