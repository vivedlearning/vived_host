import { HostAppObjectRepo } from "../../../HostAppObject";
import { EditAppAssetUC } from "../UCs/EditAppAssetUC";

export function editAppAsset(assetID: string, appObjects: HostAppObjectRepo) {
  const uc = EditAppAssetUC.get(appObjects);
  if (!uc) {
    appObjects.submitWarning("editAppAsset", "Unable to find EditAppAssetUC");
    return;
  }

  uc.editAsset(assetID);
}
