import { HostAppObjectRepo } from "../../../HostAppObject";
import { AssetPluginContainerUC } from "../UCs/AssetPluginContainerUC";

export function clearAssetPluginContainer(
  appObject: HostAppObjectRepo
) {
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
