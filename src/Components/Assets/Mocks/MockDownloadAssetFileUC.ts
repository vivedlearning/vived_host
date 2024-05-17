import { HostAppObject, HostAppObjectRepo } from "../../../HostAppObject";
import { DownloadAssetFileUC } from "../UCs/DownloadAssetFileUC";

export class MockDownloadAssetFileUC extends DownloadAssetFileUC {
  download = jest.fn();
  saveFileLocally = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, DownloadAssetFileUC.type);
  }
}

export function makeMockDownloadAssetFileUC(appObjects: HostAppObjectRepo) {
  return new MockDownloadAssetFileUC(appObjects.getOrCreate("MockDownloadAssetFileUC"));
}
