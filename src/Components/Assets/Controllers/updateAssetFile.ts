import { HostAppObjectRepo } from "../../../HostAppObject";
import { UpdateAssetFileUC } from "../UCs/UpdateAssetFileUC";

export function updateAssetFile(
  file: File,
  assetID: string,
  appObjects: HostAppObjectRepo
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
