import { HostAppObjectRepo } from "../../../HostAppObject";
import { AssetPluginContainerUC } from "../UCs/AssetPluginContainerUC";

export function setAssetPluginContainer(
  container: HTMLElement,
  appObject: HostAppObjectRepo
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
