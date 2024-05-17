import { HostAppObjectRepo } from "../../../HostAppObject";
import { GetAppAssetsUC } from "../UCs/GetAppAssetsUC";

export function getAppAssets(appID: string, appObjects: HostAppObjectRepo) {
  const uc = GetAppAssetsUC.get(appObjects);
  if (!uc) {
    appObjects.submitWarning("getAppAssets", "Unable to find GetAppAssetsUC");
    return;
  }

  uc.getAppAssets(appID);
}
