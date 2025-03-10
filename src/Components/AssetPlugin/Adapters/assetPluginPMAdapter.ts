import { AppObjectRepo, SingletonPmAdapter } from "@vived/core";
import { AssetPluginPM, AssetPluginVM } from "../PM/AssetPluginPM";

export const assetPluginPMAdapter: SingletonPmAdapter<AssetPluginVM> = {
  defaultVM: {
    show: false,
    loading: false,
    styleSheets: []
  },
  subscribe: (
    appObjects: AppObjectRepo,
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
    appObjects: AppObjectRepo,
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
