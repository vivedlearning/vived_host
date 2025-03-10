import { AppObjectRepo, SingletonPmAdapter } from "@vived/core";
import { DevFeaturesEnabledPM } from "../PMs/DevFeaturesEnabledPM";

export const devFeaturesEnabledAdapter: SingletonPmAdapter<boolean> = {
  defaultVM: true,
  subscribe: (appObjects: AppObjectRepo, setVM: (vm: boolean) => void) => {
    const pm = DevFeaturesEnabledPM.get(appObjects);
    if (!pm) {
      appObjects.submitError(
        "devFeaturesEnabledAdapter",
        "Unable to find DevFeaturesEnabledPM"
      );
      return;
    }
    pm.addView(setVM);
  },
  unsubscribe: (appObjects: AppObjectRepo, setVM: (vm: boolean) => void) => {
    const pm = DevFeaturesEnabledPM.get(appObjects);
    if (!pm) {
      appObjects.submitError(
        "devFeaturesEnabledAdapter",
        "Unable to find DevFeaturesEnabledPM"
      );
      return;
    }
    pm.removeView(setVM);
  }
};
