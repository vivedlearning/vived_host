import { AppObjectRepo, SingletonPmAdapter } from "@vived/core";
import { EmulateZSpacePM } from "../PMs/EmulateZSpacePM";

export const emulateZSpaceAdapter: SingletonPmAdapter<boolean> = {
  defaultVM: false,
  subscribe: (appObjects: AppObjectRepo, setVM: (vm: boolean) => void) => {
    const pm = EmulateZSpacePM.get(appObjects);
    if (!pm) {
      appObjects.submitError(
        "emulateZSpaceAdapter",
        "Unable to find EmulateZSpacePM"
      );
      return;
    }
    pm.addView(setVM);
  },
  unsubscribe: (appObjects: AppObjectRepo, setVM: (vm: boolean) => void) => {
    const pm = EmulateZSpacePM.get(appObjects);
    if (!pm) {
      appObjects.submitError(
        "emulateZSpaceAdapter",
        "Unable to find EmulateZSpacePM"
      );
      return;
    }
    pm.removeView(setVM);
  }
};
