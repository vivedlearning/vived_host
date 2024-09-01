import { HostAppObject, HostAppObjectRepo } from "../../../HostAppObject";
import { DownloadLogUC } from "../UCs";

export class MockDownloadLogUC extends DownloadLogUC {
  downloadFile = jest.fn();
  doDownload = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, DownloadLogUC.type);
  }
}

export function makeMockDownloadLogUC(appObjects: HostAppObjectRepo) {
  return new MockDownloadLogUC(appObjects.getOrCreate("MockDownloadLogUC"));
}
