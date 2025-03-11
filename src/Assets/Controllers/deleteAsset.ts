import { AppObjectRepo } from "@vived/core";
import { DeleteAssetUC } from "../UCs/DeleteAssetUC";

export function deleteAsset(assetID: string, appObjects: AppObjectRepo) {
  const uc = DeleteAssetUC.get(assetID, appObjects);
  if (!uc) {
    appObjects.submitWarning("deleteAsset", "Unable to find DeleteAssetUC");
    return;
  }

  uc.deleteWithConfirm();
}
