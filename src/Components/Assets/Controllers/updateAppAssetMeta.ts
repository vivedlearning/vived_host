import { HostAppObjectRepo } from "../../../HostAppObject";
import {
  UpdateAppAssetMetaUC,
  UpdateAppAssetMetaDTO
} from "../UCs/UpdateAppAssetMetaUC";

export function updateAppAssetMeta(
  data: UpdateAppAssetMetaDTO,
  assetID: string,
  appObjects: HostAppObjectRepo
) {
  const uc = UpdateAppAssetMetaUC.get(assetID, appObjects);
  if (!uc) {
    appObjects.submitWarning(
      "updateAppAssetMeta",
      "Unable to find UpdateAssetMetaUC"
    );
    return;
  }

  uc.updateMeta(data);
}
