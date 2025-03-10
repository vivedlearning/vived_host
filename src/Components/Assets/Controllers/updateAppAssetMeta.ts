import { AppObjectRepo } from "@vived/core";
import {
  UpdateAppAssetMetaUC,
  UpdateAppAssetMetaDTO
} from "../UCs/UpdateAppAssetMetaUC";

export function updateAppAssetMeta(
  data: UpdateAppAssetMetaDTO,
  assetID: string,
  appObjects: AppObjectRepo
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
