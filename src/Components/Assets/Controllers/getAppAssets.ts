import { AppObjectRepo } from "@vived/core";
import { GetAppAssetsUC } from "../UCs/GetAppAssetsUC";

export function getAppAssets(appID: string, appObjects: AppObjectRepo) {
  const uc = GetAppAssetsUC.get(appObjects);
  if (!uc) {
    appObjects.submitWarning("getAppAssets", "Unable to find GetAppAssetsUC");
    return;
  }

  uc.getAppAssets(appID);
}
