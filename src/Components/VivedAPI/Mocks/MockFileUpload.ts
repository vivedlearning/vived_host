import { HostAppObject, HostAppObjectRepo } from "../../../HostAppObject";
import { FileUploadUC } from "../UCs/FileUploadUC";

export class MockFileUploadUC extends FileUploadUC {
  doUpload = jest.fn().mockResolvedValue(undefined);

  constructor(appObject: HostAppObject) {
    super(appObject, FileUploadUC.type);
  }
}

export function makeMockFileUploadUC(appObjects: HostAppObjectRepo) {
  return new MockFileUploadUC(appObjects.getOrCreate("MockFileUploadUC"));
}
