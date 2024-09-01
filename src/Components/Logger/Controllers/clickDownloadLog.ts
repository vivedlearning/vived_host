import { HostAppObjectRepo } from "../../../HostAppObject";
import { DownloadLogUC } from "../UCs";

export function clickDownloadLog(appObjects: HostAppObjectRepo) {
  const uc = DownloadLogUC.get(appObjects);
  if (uc) {
    uc.doDownload();
  } else {
    appObjects.submitError("clickDownloadLog", "Unable to find DownloadLogUC");
  }
}
