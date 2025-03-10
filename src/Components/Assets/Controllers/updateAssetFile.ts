import { AppObjectRepo } from "@vived/core";
import { UpdateAssetFileUC } from "../UCs/UpdateAssetFileUC";

export function updateAssetFile(
  file: File,
  assetID: string,
  appObjects: AppObjectRepo
) {
  const uc = UpdateAssetFileUC.get(assetID, appObjects);
  if (!uc) {
    appObjects.submitWarning(
      "updateAssetFile",
      "Unable to find UpdateAssetFileUC"
    );
    return;
  }

  uc.updateFile(file);
}
