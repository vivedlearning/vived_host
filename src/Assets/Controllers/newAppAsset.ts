import { AppObjectRepo } from "@vived/core";
import { NewAppAssetDTO, NewAppAssetUC } from "../UCs/NewAppAssetUC";

export function newAppAsset(
  data: NewAppAssetDTO,
  appObjects: AppObjectRepo
): Promise<void> {
  const uc = NewAppAssetUC.get(appObjects);
  if (!uc) {
    appObjects.submitWarning("newAppAsset", "Unable to find NewAppAssetUC");
    return Promise.reject();
  }

  return uc.create(data);
}
