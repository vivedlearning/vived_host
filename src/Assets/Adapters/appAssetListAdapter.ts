import { AppObjectRepo, SingletonPmAdapter } from "@vived/core";
import { AppAssetListPM } from "../PMs/AppAssetListPM";

export const appAssetListAdapter: SingletonPmAdapter<string[]> = {
  defaultVM: [],
  subscribe: (appObjects: AppObjectRepo, setVM: (vm: string[]) => void) => {
    const pm = AppAssetListPM.get(appObjects);
    if (!pm) {
      appObjects.submitError(
        "activeAppPMAdapter",
        "Unable to find AppAssetListPM"
      );
      return;
    }
    pm.addView(setVM);
  },
  unsubscribe: (appObjects: AppObjectRepo, setVM: (vm: string[]) => void) => {
    const pm = AppAssetListPM.get(appObjects);
    if (!pm) {
      appObjects.submitError(
        "activeAppPMAdapter",
        "Unable to find AppAssetListPM"
      );
      return;
    }
    pm.removeView(setVM);
  }
};
