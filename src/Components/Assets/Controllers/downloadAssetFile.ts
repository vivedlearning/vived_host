import { HostAppObjectRepo } from "../../../HostAppObject";
import { DownloadAssetFileUC } from "../UCs/DownloadAssetFileUC";

export function downloadAssetFile(
  assetID: string,
  appObjects: HostAppObjectRepo
) {
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
