import { HostAppObjectRepo } from "../../../HostAppObject";
import { SingletonPmAdapter } from "../../../Types";
import {
  AssetPluginPM,
  AssetPluginVM,
  defaultAssetPluginVM
} from "../PM/AssetPluginPM";

export const assetPluginPMAdapter: SingletonPmAdapter<AssetPluginVM> = {
  defaultVM: defaultAssetPluginVM,
  subscribe: (
    appObjects: HostAppObjectRepo,
    setVM: (vm: AssetPluginVM) => void
  ) => {
    const pm = AssetPluginPM.get(appObjects);
    if (!pm) {
      appObjects.submitError(
        "assetPluginPMAdapter",
        "Unable to find AssetPluginPM"
      );
      return;
    }
    pm.addView(setVM);
  },
  unsubscribe: (
    appObjects: HostAppObjectRepo,
    setVM: (vm: AssetPluginVM) => void
  ) => {
    const pm = AssetPluginPM.get(appObjects);
    if (!pm) {
      appObjects.submitError(
        "assetPluginPMAdapter",
        "Unable to find AssetPluginPM"
      );
      return;
    }
    pm.removeView(setVM);
  }
};
