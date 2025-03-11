import { AppObjectRepo } from "@vived/core";
import { AssetPluginContainerUC } from "../UCs/AssetPluginContainerUC";

export function setAssetPluginContainer(
  container: HTMLElement,
  appObject: AppObjectRepo
) {
  const uc = AssetPluginContainerUC.get(appObject);
  if (uc) {
    uc.setContainer(container);
  } else {
    appObject.submitWarning(
      "setAssetPluginContainer",
      "Unable to find AssetPluginContainerUC"
    );
  }
}
