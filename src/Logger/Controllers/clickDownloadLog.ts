import { AppObjectRepo } from "@vived/core";
import { DownloadLogUC } from "../UCs";

export function clickDownloadLog(appObjects: AppObjectRepo) {
  const uc = DownloadLogUC.get(appObjects);
  if (uc) {
    uc.doDownload();
  } else {
    appObjects.submitError("clickDownloadLog", "Unable to find DownloadLogUC");
  }
}
