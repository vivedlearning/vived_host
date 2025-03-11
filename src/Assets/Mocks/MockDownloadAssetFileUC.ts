import { AppObject, AppObjectRepo } from "@vived/core";
import { DownloadAssetFileUC } from "../UCs/DownloadAssetFileUC";

export class MockDownloadAssetFileUC extends DownloadAssetFileUC {
  download = jest.fn();
  saveFileLocally = jest.fn();

  constructor(appObject: AppObject) {
    super(appObject, DownloadAssetFileUC.type);
  }
}

export function makeMockDownloadAssetFileUC(appObjects: AppObjectRepo) {
  return new MockDownloadAssetFileUC(
    appObjects.getOrCreate("MockDownloadAssetFileUC")
  );
}
