import { AppObject, AppObjectRepo } from "@vived/core";
import { DownloadLogUC } from "../UCs";

export class MockDownloadLogUC extends DownloadLogUC {
  downloadFile = jest.fn();
  doDownload = jest.fn();

  constructor(appObject: AppObject) {
    super(appObject, DownloadLogUC.type);
  }
}

export function makeMockDownloadLogUC(appObjects: AppObjectRepo) {
  return new MockDownloadLogUC(appObjects.getOrCreate("MockDownloadLogUC"));
}
