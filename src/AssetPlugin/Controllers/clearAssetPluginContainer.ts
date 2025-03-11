import { AppObjectRepo } from "@vived/core";
import { AssetPluginContainerUC } from "../UCs/AssetPluginContainerUC";

export function clearAssetPluginContainer(appObject: AppObjectRepo) {
  const uc = AssetPluginContainerUC.get(appObject);
  if (uc) {
    uc.clearContainer();
  } else {
    appObject.submitWarning(
      "clearAssetPluginContainer",
      "Unable to find AssetPluginContainerUC"
    );
  }
}
