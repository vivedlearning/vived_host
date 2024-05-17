import { HostAppObjectRepo } from "../../../HostAppObject";
import { DeleteAssetUC } from "../UCs/DeleteAssetUC";


export function deleteAsset(assetID: string, appObjects: HostAppObjectRepo) {
  const uc = DeleteAssetUC.get(assetID, appObjects);
  if(!uc) {
    appObjects.submitWarning("deleteAsset", "Unable to find DeleteAssetUC");
    return;
  }

  uc.deleteWithConfirm();
}

