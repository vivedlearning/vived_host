import { HostAppObjectRepo } from "../../../HostAppObject";
import { SingletonPmAdapter } from "../../../Types";
import {
AppAssetListPM
} from "../PMs/AppAssetListPM";

export const appAssetListAdapter: SingletonPmAdapter<string[]> = {
  defaultVM: [],
  subscribe: (
    appObjects: HostAppObjectRepo,
    setVM: (vm: string[]) => void
  ) => {
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
  unsubscribe: (
    appObjects: HostAppObjectRepo,
    setVM: (vm: string[]) => void
  ) => {
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
