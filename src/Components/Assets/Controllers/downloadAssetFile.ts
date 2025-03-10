import { AppObjectRepo } from "@vived/core";
import { DownloadAssetFileUC } from "../UCs/DownloadAssetFileUC";

export function downloadAssetFile(assetID: string, appObjects: AppObjectRepo) {
  const uc = DownloadAssetFileUC.get(assetID, appObjects);
  if (!uc) {
    appObjects.submitWarning(
      "deleteAsset",
      "Unable to find DownloadAssetFileUC"
    );
    return;
  }

  uc.download();
}
